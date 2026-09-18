import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { TransactionStatus } from 'web-components-lib';

export const TABLE_OPTIONS_DOCUMENTS = [
  { id: 'opt1', icon: 'view', text: 'Ver documento' },
  { id: 'opt2', icon: 'remove', text: 'Eliminar documento' },
  { id: 'opt3', icon: 'edit', text: 'Editar documento' },
];

export const TABLE_DOCUMENT_OPTIONS: BcTableOptionMenu[] = [
  {
    id: 'opt1',
    icon: 'view',
    text: 'Ver documento',
    action: function (_param: unknown): object {
      return {};
    },
  },
  {
    id: 'opt2',
    icon: 'remove',
    text: 'Eliminar documento',
    action: function (_param: unknown): object {
      return {};
    },
  },
  {
    id: 'opt3',
    icon: 'edit',
    text: 'Editar documento',
    action: function (_param: unknown): object {
      return {};
    },
  },
];

export const MODAL_CONFIRM_DELETE_DOCUMENT = {
  title: 'Eliminar documento',
  paragraph: 'El documento se eliminará de forma permanente. ¿Deseas continuar?',
  status: { enabled: true, type: TransactionStatus.info },
  buttons: {
    enabled: true,
    orientation: 'horizontal',
    buttonsList: [
      { id: 'accept', label: 'Sí, eliminar', type: 'primary' },
      { id: 'cancel', label: 'Cancelar', type: 'secondary' },
    ],
  },
};

export const PAGINATOR_CONFIG = {
  ID: 'documentsPaginator',
  TYPE: 'basic',
  DEFAULT_ITEMS_PER_PAGE: 10,
  INITIAL_PAGE: 1,
  PAGE_OFFSET: 1,
  EMPTY_COUNT: 0,
} as const;





import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { EventsService } from '@core/services/events/events.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ButtonComponent } from 'web-components-lib';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonComponent,
  ],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit {
  private static readonly URL_REGEX_PATTERN = 'https?://.+';
  private static readonly ROUTE_LIST = '/admin/list-documents';

  private static readonly PARAM_ORG = 'org';
  private static readonly PARAM_REPO = 'repo';
  private static readonly PARAM_MODE = 'mode';

  private static readonly EVENT_ERROR_NOTIFICATION = 'error_notification';
  private static readonly MSG_LOAD_ERROR = 'No se pudo cargar la información del recurso.';
  private static readonly MSG_UPDATE_ERROR = 'Error al actualizar el recurso de documentación.';
  private static readonly MSG_CREATE_ERROR = 'Error al crear el recurso de documentación.';

  private static readonly TITLE_VIEW = 'Detalle del recurso de documentación';
  private static readonly TITLE_EDIT = 'Editar recurso de documentación';
  private static readonly TITLE_CREATE = 'Crear recurso de documentación';

  private static readonly SUBTITLE_VIEW = 'Visualización en modo lectura';
  private static readonly SUBTITLE_EDIT = 'Actualizar información del repositorio';
  private static readonly SUBTITLE_CREATE = 'Registrar nuevo repositorio';

  private static readonly BTN_BACK = 'Volver';
  private static readonly BTN_CANCEL = 'Cancelar';
  private static readonly BTN_SUBMITTING = 'Guardando...';
  private static readonly BTN_UPDATE = 'Actualizar recurso';
  private static readonly BTN_CREATE = 'Guardar recurso';

  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _docService = inject(DocumentationService);
  private readonly _eventsService = inject(EventsService);

  public readonly $isEditMode = signal<boolean>(false);
  public readonly $isViewMode = signal<boolean>(false);
  public readonly $isSubmitting = signal<boolean>(false);
  public readonly $errorMessage = signal<string | null>(null);

  public readonly $headerTitle = computed<string>(() => {
    if (this.$isViewMode()) {
      return CreateDocumentComponent.TITLE_VIEW;
    }
    if (this.$isEditMode()) {
      return CreateDocumentComponent.TITLE_EDIT;
    }
    return CreateDocumentComponent.TITLE_CREATE;
  });

  public readonly $headerSubtitle = computed<string>(() => {
    if (this.$isViewMode()) {
      return CreateDocumentComponent.SUBTITLE_VIEW;
    }
    if (this.$isEditMode()) {
      return CreateDocumentComponent.SUBTITLE_EDIT;
    }
    return CreateDocumentComponent.SUBTITLE_CREATE;
  });

  public readonly $cancelButtonText = computed<string>(() => {
    return this.$isViewMode()
      ? CreateDocumentComponent.BTN_BACK
      : CreateDocumentComponent.BTN_CANCEL;
  });

  public readonly $submitButtonText = computed<string>(() => {
    if (this.$isSubmitting()) {
      return CreateDocumentComponent.BTN_SUBMITTING;
    }
    if (this.$isEditMode()) {
      return CreateDocumentComponent.BTN_UPDATE;
    }
    return CreateDocumentComponent.BTN_CREATE;
  });

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
        this.notifyError(CreateDocumentComponent.MSG_LOAD_ERROR);
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
          const message = err?.error?.message ?? CreateDocumentComponent.MSG_UPDATE_ERROR;
          this.notifyError(message);
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
        const message = err?.error?.message ?? CreateDocumentComponent.MSG_CREATE_ERROR;
        this.notifyError(message);
      },
    });
  }

  private notifyError(message: string): void {
    this.$isSubmitting.set(false);
    this.$errorMessage.set(message);
    this._eventsService.sendEvent(CreateDocumentComponent.EVENT_ERROR_NOTIFICATION, { message })?.subscribe();
  }

  private handleSuccess(): void {
    this.$isSubmitting.set(false);
    this._router.navigate([CreateDocumentComponent.ROUTE_LIST]);
  }

  public onCancel(): void {
    this._router.navigate([CreateDocumentComponent.ROUTE_LIST]);
  }
}





@let isView = $isViewMode();
@let errorMsg = $errorMessage();
@let submitting = $isSubmitting();

<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="$headerTitle()"
    [$subtitle]="$headerSubtitle()"
    [$backRoute]="'/admin/list-documents'"
  />

  @if (errorMsg) {
    <div class="form-alert form-alert-danger" role="alert">
      {{ errorMsg }}
    </div>
  }

  <div class="form-card">
    <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="organization">
            Organización <span class="required">*</span>
          </label>
          <input
            id="organization"
            type="text"
            formControlName="organization"
            class="form-control"
            [class.is-invalid]="resourceForm.controls.organization.touched && resourceForm.controls.organization.invalid"
            placeholder="ej. grupobancolombia-innersource"
          />
          @if (resourceForm.controls.organization.touched && resourceForm.controls.organization.hasError('required')) {
            <span class="feedback-error">La organización es requerida.</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="repositoryName">
            Nombre del Repositorio <span class="required">*</span>
          </label>
          <input
            id="repositoryName"
            type="text"
            formControlName="repositoryName"
            class="form-control"
            [class.is-invalid]="resourceForm.controls.repositoryName.touched && resourceForm.controls.repositoryName.invalid"
            placeholder="ej. NU5740001_Metrics_Doc"
          />
          @if (resourceForm.controls.repositoryName.touched && resourceForm.controls.repositoryName.hasError('required')) {
            <span class="feedback-error">El nombre del repositorio es requerido.</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="name">Nombre visible</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            placeholder="ej. Documentación Métricas Corporativas"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="url">URL del repositorio</label>
          <input
            id="url"
            type="url"
            formControlName="url"
            class="form-control"
            [class.is-invalid]="resourceForm.controls.url.touched && resourceForm.controls.url.invalid"
            placeholder="https://github.com/..."
          />
          @if (resourceForm.controls.url.touched && resourceForm.controls.url.hasError('pattern')) {
            <span class="feedback-error">Debe ser una URL válida (http:// o https://).</span>
          }
        </div>

        <div class="form-group form-group-full">
          <label class="form-label" for="description">Descripción</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            placeholder="Describe brevemente el alcance de esta documentación..."
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <nv-button
          typeButton="secondary"
          sizeButton="small"
          width="hug"
          (click)="onCancel()"
          [disabled]="submitting"
        >
          {{ $cancelButtonText() }}
        </nv-button>

        @if (!isView) {
          <nv-button
            typeButton="primary"
            sizeButton="small"
            width="hug"
            (click)="onSubmit()"
            [disabled]="resourceForm.invalid || submitting"
          >
            {{ $submitButtonText() }}
          </nv-button>
        }
      </div>
    </form>
  </div>
</section>




textarea.form-control {
  min-height: 6.5rem;
  resize: vertical;
}



import { Component, computed, input, output, signal } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import { PAGINATOR_CONFIG } from '@core/constants/table-documents.contant';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IPaginatorV2ChangeEvent,
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

  public readonly paginatorId = PAGINATOR_CONFIG.ID;
  public readonly paginatorType = PAGINATOR_CONFIG.TYPE;
  public readonly initialPage = PAGINATOR_CONFIG.INITIAL_PAGE;

  public readonly $currentPage = signal<number>(PAGINATOR_CONFIG.INITIAL_PAGE);
  public readonly $itemsPerPage = signal<number>(PAGINATOR_CONFIG.DEFAULT_ITEMS_PER_PAGE);

  public readonly $totalPages = computed<number>(() => {
    const totalRecords = this.$data().length;
    const perPage = this.$itemsPerPage();
    return totalRecords > PAGINATOR_CONFIG.EMPTY_COUNT
      ? Math.ceil(totalRecords / perPage)
      : PAGINATOR_CONFIG.INITIAL_PAGE;
  });

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const startIndex = (this.$currentPage() - PAGINATOR_CONFIG.PAGE_OFFSET) * this.$itemsPerPage();
    return this.$data().slice(startIndex, startIndex + this.$itemsPerPage());
  });

  public onPageChange(event: IPaginatorV2ChangeEvent): void {
    if (!event || typeof event.currentPage !== 'number') {
      return;
    }

    const requestedPage = event.currentPage;
    const maxPages = this.$totalPages();

    if (requestedPage > maxPages) {
      event.noMoreRecords?.();
      return;
    }

    this.$currentPage.set(requestedPage);

    if (requestedPage === maxPages) {
      event.noMoreRecords?.();
    }
  }

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event?.optionSelected ?? event?.optionSeleted ?? event?.id ?? event?.value ?? '';

    const normalizedAction = rawOption.trim().toUpperCase();

    const eventPayload: IEventSelectDocument = {
      optionSeleted: normalizedAction,
      optionSelected: normalizedAction,
      rowData: row,
    };

    this.$optionSelect.emit({
      option: eventPayload,
      row,
      optionSelected: normalizedAction,
      rowData: row,
    } as unknown as ITableDocuments);
  }
}


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
  private static readonly EMPTY_COUNT = 0;

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

  public readonly $cellOptions = signal<BcTableOptionMenu[]>(TABLE_DOCUMENT_OPTIONS);

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

    if (userPermissions.length === ListDocumentsComponent.EMPTY_COUNT) {
      return true;
    }

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
    const rawOption = event?.option?.optionSeleted ?? event?.optionSelected ?? '';
    const selectedOption = rawOption.trim().toUpperCase();
    const row = event?.row ?? event?.rowData;

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



