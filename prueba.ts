import { FormControl } from '@angular/forms';

export enum EResourceViewMode {
  VIEW = 'view',
  EDIT = 'edit',
}

export interface IResourceForm {
  organization: FormControl<string>;
  repositoryName: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}

export interface IApiHttpError {
  error?: {
    message?: string;
  };
}

export interface IDropdownOptionEvent {
  optionSeleted?: string;
  optionSelected?: string;
  id?: string;
  value?: string;
}


-----------------

import { Component, input, output } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';

@Component({
  selector: 'app-list-all-documents',
  standalone: true,
  imports: [BcTableModule, BcTooltipModule, BcPaginatorV2Module],
  templateUrl: './list-all-documents.component.html',
  styleUrl: './list-all-documents.component.scss',
})
export class ListAllDocumentsComponent {
  readonly $data = input.required<IRowDocument[]>();
  readonly $cellOptions = input.required<BcTableOptionMenu[]>();

  readonly $optionSelect = output<ITableDocuments>();

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event.optionSeleted ?? event.optionSelected ?? event.id ?? event.value ?? '';

    const optionPayload: IEventSelectDocument = {
      optionSeleted: rawOption.toUpperCase(),
      rowData: row,
    };

    this.$optionSelect.emit({
      option: optionPayload,
      row,
    });
  }
}




-----------------



import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { PERMISSION_DOCUMENTS_CREATE } from '@core/constants/permission-list.constant';
import {
  MODAL_CONFIRM_DELETE_DOCUMENT,
  TABLE_DOCUMENT_OPTIONS,
  TABLE_OPTIONS_DOCUMENTS,
} from '@core/constants/table-documents.contant';
import {
  EResourceViewMode,
  IDocumentationResource,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';
import { EEventSelectItem } from '@core/models/table-dashboard.model';
import { TContextualPermission } from '@core/models/permissions-engine.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { GlobalStoreService } from '@shared/store/global-store.service';
import { PermissionsEngine } from '@shared/utils/permissions-engine/permissions-engine';
import {
  ButtonComponent,
  ModalComponent,
  ModalConfig,
} from 'web-components-lib';

import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SkeletonGridComponent } from '@shared/components/skeleton-grid/skeleton-grid.component';
import { ListAllDocumentsComponent } from '@features/admin/components/list-all-documents/list-all-documents.component';

@Component({
  selector: 'app-list-documents',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ListAllDocumentsComponent,
    ButtonComponent,
    ModalComponent,
    SkeletonGridComponent,
    ErrorStateComponent,
  ],
  templateUrl: './list-documents.component.html',
  styleUrl: './list-documents.component.scss',
})
export class ListDocumentsComponent implements OnInit, OnDestroy {
  private static readonly ROUTE_CREATE = '/admin/create-document';
  private static readonly ROUTE_DASHBOARD = '/dashboard';
  private static readonly BUTTON_ACCEPT = 'accept';
  private static readonly MODAL_CLOSE_CANCEL = 'button-cancel';
  private static readonly MODAL_CLOSE_ACCEPT = 'button-accept';
  private static readonly EVENT_VIEW_SESSION = 'documents_management_view';
  private static readonly STORE_PERMISSIONS_KEY = 'PERMISSIONS';

  private static readonly PARAM_ORG = 'org';
  private static readonly PARAM_REPO = 'repo';
  private static readonly PARAM_MODE = 'mode';

  private readonly _router = inject(Router);
  private readonly _eventsService = inject(EventsService);
  private readonly _docService = inject(DocumentationService);
  private readonly _globalStoreService = inject(GlobalStoreService);
  private readonly _destroy$ = new Subject<void>();

  public readonly modal = viewChild<ModalComponent>('modal');
  public readonly $documentToDelete = signal<IDocumentationResource | null>(null);

  public readonly cellOption: BcTableOptionMenu[] = TABLE_DOCUMENT_OPTIONS;

  public readonly $modalInformation = signal<Partial<ModalConfig>>(
    MODAL_CONFIRM_DELETE_DOCUMENT
  );

  public readonly resourceDocuments = rxResource({
    stream: () => this._docService.getResources(),
    defaultValue: [] as IDocumentationResource[],
  });

  public readonly $permissionCreate = computed<boolean>(() => {
    const userPermissions =
      (this._globalStoreService.selector(ListDocumentsComponent.STORE_PERMISSIONS_KEY)() as TContextualPermission[]) ?? [];
    return PermissionsEngine.evaluate(PERMISSION_DOCUMENTS_CREATE, userPermissions);
  });

  public readonly $documentsViewModels = computed<IRowDocument[]>(() => {
    return this.resourceDocuments.value().map((data: IDocumentationResource) => {
      const formattedDate = data.lastSyncedAt
        ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.lastSyncedAt))
        : 'Sin sincronizar';

      return {
        id: `${data.organization}/${data.repositoryName}`,
        title: data.name ?? data.repositoryName,
        region: data.organization,
        created: data.lastSyncedAt ? new Date(data.lastSyncedAt) : new Date(),
        modified: data.lastSyncedAt ? new Date(data.lastSyncedAt) : new Date(),
        organization: data.organization,
        repositoryName: data.repositoryName,
        name: data.name,
        description: data.description,
        url: data.url,
        lastSyncedAt: data.lastSyncedAt,
        lastSyncedAtFormatted: formattedDate,
        menu: TABLE_OPTIONS_DOCUMENTS,
      };
    });
  });

  ngOnInit(): void {
    this._eventsService
      .sendEvent(ListDocumentsComponent.EVENT_VIEW_SESSION, { start_session: new Date().toISOString() })
      ?.pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  public onTableOptionSelect(event: ITableDocuments): void {
    const rawOption = event.option?.optionSeleted ?? '';
    const selectedOption = rawOption.toUpperCase();
    const row = event.row;

    if (!row || !selectedOption) {
      return;
    }

    if (selectedOption === EEventSelectItem.OPT2) {
      this.promptDeleteModal(row);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT1) {
      this.navigateWithMode(row, EResourceViewMode.VIEW);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT3) {
      this.navigateWithMode(row, EResourceViewMode.EDIT);
      return;
    }
  }

  private promptDeleteModal(row: IRowDocument): void {
    const resource: IDocumentationResource = {
      organization: row.organization ?? '',
      repositoryName: row.repositoryName ?? '',
      name: row.name,
      description: row.description,
      url: row.url,
      lastSyncedAt: row.lastSyncedAt ?? null,
    };

    this.$documentToDelete.set(resource);
    this.$modalInformation.update((prev) => ({
      ...prev,
      paragraph: `¿Estás seguro de que deseas eliminar el recurso "${resource.repositoryName}"?`,
    }));
    this.modal()?.showModal();
  }

  private navigateWithMode(row: IRowDocument, mode: EResourceViewMode): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_CREATE], {
      queryParams: {
        [ListDocumentsComponent.PARAM_ORG]: row.organization,
        [ListDocumentsComponent.PARAM_REPO]: row.repositoryName,
        [ListDocumentsComponent.PARAM_MODE]: mode,
      },
    });
  }

  public handleModalAction(buttonId: string): void {
    if (buttonId !== ListDocumentsComponent.BUTTON_ACCEPT) {
      this.modal()?.handleClose(ListDocumentsComponent.MODAL_CLOSE_CANCEL);
      return;
    }

    const currentDoc = this.$documentToDelete();
    if (!currentDoc) {
      return;
    }

    this._docService
      .deleteResource(currentDoc.organization, currentDoc.repositoryName)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.resourceDocuments.reload();
          this.modal()?.handleClose(ListDocumentsComponent.MODAL_CLOSE_ACCEPT);
        },
      });
  }

  public goToCreateNewDocument(): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_CREATE]);
  }

  public goBack(): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_DASHBOARD]);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}


-----------------



import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EResourceViewMode,
  IApiHttpError,
  ICreateResourcePayload,
  IDocumentationResource,
  IResourceForm,
  IUpdateResourcePayload,
} from '@core/models/documents.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ButtonComponent } from 'web-components-lib';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit {
  private static readonly URL_REGEX_PATTERN = 'https?://.+';
  private static readonly ROUTE_LIST = '/admin/list-documents';

  private static readonly PARAM_ORG = 'org';
  private static readonly PARAM_REPO = 'repo';
  private static readonly PARAM_MODE = 'mode';

  private static readonly MSG_LOAD_ERROR = 'No se pudo cargar la información del recurso.';
  private static readonly MSG_UPDATE_ERROR = 'Error al actualizar el recurso de documentación.';
  private static readonly MSG_CREATE_ERROR = 'Error al crear el recurso de documentación.';

  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _docService = inject(DocumentationService);

  public readonly $isEditMode = signal<boolean>(false);
  public readonly $isViewMode = signal<boolean>(false);
  public readonly $isSubmitting = signal<boolean>(false);
  public readonly $errorMessage = signal<string | null>(null);

  private _currentOrg = '';
  private _currentRepo = '';

  public resourceForm: FormGroup<IResourceForm> = this._fb.group({
    organization: this._fb.nonNullable.control('', [Validators.required]),
    repositoryName: this._fb.nonNullable.control('', [Validators.required]),
    name: this._fb.nonNullable.control(''),
    description: this._fb.nonNullable.control(''),
    url: this._fb.nonNullable.control('', [Validators.pattern(CreateDocumentComponent.URL_REGEX_PATTERN)]),
  });

  ngOnInit(): void {
    const org = this._route.snapshot.queryParamMap.get(CreateDocumentComponent.PARAM_ORG);
    const repo = this._route.snapshot.queryParamMap.get(CreateDocumentComponent.PARAM_REPO);
    const mode = this._route.snapshot.queryParamMap.get(CreateDocumentComponent.PARAM_MODE);

    if (!org || !repo) {
      return;
    }

    this._currentOrg = org;
    this._currentRepo = repo;

    this.applyModeRestrictions(mode);
    this.loadResourceData(org, repo);
  }

  private applyModeRestrictions(mode: string | null): void {
    if (mode === EResourceViewMode.VIEW) {
      this.$isViewMode.set(true);
      this.resourceForm.disable();
      return;
    }

    this.$isEditMode.set(true);
    this.resourceForm.controls.organization.disable();
    this.resourceForm.controls.repositoryName.disable();
  }

  private loadResourceData(org: string, repo: string): void {
    this._docService.getResourceById(org, repo).subscribe({
      next: (resource: IDocumentationResource) => {
        this.resourceForm.patchValue({
          organization: resource.organization,
          repositoryName: resource.repositoryName,
          name: resource.name ?? '',
          description: resource.description ?? '',
          url: resource.url ?? '',
        });
      },
      error: () => {
        this.$errorMessage.set(CreateDocumentComponent.MSG_LOAD_ERROR);
      },
    });
  }

  public onSubmit(): void {
    if (this.$isViewMode() || this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    this.$isSubmitting.set(true);
    this.$errorMessage.set(null);

    if (this.$isEditMode()) {
      this.submitUpdate();
      return;
    }

    this.submitCreate();
  }

  private submitUpdate(): void {
    const updatePayload: IUpdateResourcePayload = {
      name: this.resourceForm.controls.name.value.trim() || undefined,
      description: this.resourceForm.controls.description.value.trim() || undefined,
      url: this.resourceForm.controls.url.value.trim() || undefined,
    };

    this._docService
      .updateResource(this._currentOrg, this._currentRepo, updatePayload)
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err: IApiHttpError) => {
          this.$isSubmitting.set(false);
          this.$errorMessage.set(
            err?.error?.message ?? CreateDocumentComponent.MSG_UPDATE_ERROR
          );
        },
      });
  }

  private submitCreate(): void {
    const raw = this.resourceForm.getRawValue();
    const createPayload: ICreateResourcePayload = {
      organization: raw.organization.trim(),
      repositoryName: raw.repositoryName.trim(),
      name: raw.name.trim() || undefined,
      description: raw.description.trim() || undefined,
      url: raw.url.trim() || undefined,
    };

    this._docService.createResource(createPayload).subscribe({
      next: () => this.handleSuccess(),
      error: (err: IApiHttpError) => {
        this.$isSubmitting.set(false);
        this.$errorMessage.set(
          err?.error?.message ?? CreateDocumentComponent.MSG_CREATE_ERROR
        );
      },
    });
  }

  private handleSuccess(): void {
    this.$isSubmitting.set(false);
    this._router.navigate([CreateDocumentComponent.ROUTE_LIST]);
  }

  public onCancel(): void {
    this._router.navigate([CreateDocumentComponent.ROUTE_LIST]);
  }
}



