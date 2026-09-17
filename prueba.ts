import { Component, input, output } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IRowDocument,
  ITableDocuments,
  ITableDropdownEventPayload,
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
    event: ITableDropdownEventPayload | string,
    row: IRowDocument
  ): void {
    const rawOption = typeof event === 'string'
      ? event
      : event.optionSeleted ?? event.optionSelected ?? event.id ?? event.value ?? '';

    this.$optionSelect.emit({
      optionSelected: rawOption.toUpperCase(),
      rowData: row,
    });
  }
}



------------------------



<td bc-cell type="action">
        <bc-table-dropdown
          [row]="row"
          [alternativeOptionId]="true"
          [options]="row.menu || []"
          (onChange)="onOptionSelected($event, row)"
        ></bc-table-dropdown>
      </td>

----------------------------------------



import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  EEventSelectItem,
} from '@core/models/table-dashboard.model';
import {
  IDocumentationResource,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { ModalConfig, TransactionStatus } from 'web-components-lib';
import { rxResource } from '@angular/core/rxjs-interop';
import { TABLE_OPTIONS_DOCUMENTS, TABLE_DOCUMENT_OPTIONS } from '@core/constants/table-documents.constant';
import { Subject, takeUntil } from 'rxjs';

const ROUTE_LIST = '/admin/list-documents';
const ROUTE_CREATE = '/admin/create-document';
const ROUTE_DASHBOARD = '/dashboard';

const QUERY_PARAM_ORG = 'org';
const QUERY_PARAM_REPO = 'repo';
const QUERY_PARAM_MODE = 'mode';
const MODE_VIEW = 'view';
const MODE_EDIT = 'edit';

@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrl: './list-documents.component.scss',
})
export class ListDocumentsComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _eventsService = inject(EventsService);
  private readonly _docService = inject(DocumentationService);
  private readonly _destroy$ = new Subject<void>();

  public readonly modal = viewChild<any>('modal');
  public readonly $documentToDelete = signal<IDocumentationResource | null>(null);

  public readonly cellOption = TABLE_DOCUMENT_OPTIONS;

  public readonly $modalInformation = signal<Partial<ModalConfig>>({
    size: 'sm',
    title: 'Confirmar eliminación',
    isDynamicContentEnable: false,
    paragraph: '¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.',
    buttons: {
      enabled: true,
      orientation: 'horizontal',
      buttonsList: [
        { id: 'cancel', label: 'Cancelar', type: 'secondary' },
        { id: 'accept', label: 'Aceptar', type: 'primary' },
      ],
    },
    status: {
      enabled: true,
      type: TransactionStatus.info,
    },
  });

  public readonly resourceDocuments = rxResource({
    stream: () => this._docService.getResources(),
    defaultValue: [] as IDocumentationResource[],
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
      .sendEvent('documents_management_view', { start_session: new Date().toISOString() })
      ?.pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  public onTableOptionSelect(event: ITableDocuments): void {
    const selectedOption = event.optionSelected?.toUpperCase();
    const row = event.rowData;

    if (!row || !selectedOption) {
      return;
    }

    if (selectedOption === 'OPT2' || selectedOption === EEventSelectItem.OPT2) {
      this.promptDeleteModal(row);
      return;
    }

    if (selectedOption === 'OPT1' || selectedOption === EEventSelectItem.OPT1) {
      this.navigateWithMode(row, MODE_VIEW);
      return;
    }

    if (selectedOption === 'OPT3' || selectedOption === EEventSelectItem.OPT3) {
      this.navigateWithMode(row, MODE_EDIT);
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

  private navigateWithMode(row: IRowDocument, mode: string): void {
    this._router.navigate([ROUTE_CREATE], {
      queryParams: {
        [QUERY_PARAM_ORG]: row.organization,
        [QUERY_PARAM_REPO]: row.repositoryName,
        [QUERY_PARAM_MODE]: mode,
      },
    });
  }

  public handleModalAction(buttonId: string): void {
    if (buttonId !== 'accept') {
      this.modal()?.handleClose('button-cancel');
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
          this.modal()?.handleClose('button-accept');
        },
      });
  }

  public goToCreateNewDocument(): void {
    this._router.navigate([ROUTE_CREATE]);
  }

  public goBack(): void {
    this._router.navigate([ROUTE_DASHBOARD]);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}


---------------------------------------------

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ICreateResourcePayload,
  IDocumentationResource,
  IUpdateResourcePayload,
} from '@core/models/documents.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ButtonComponent } from 'web-components-lib';

interface IResourceForm {
  organization: FormControl<string>;
  repositoryName: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}

const URL_PATTERN = 'https?://.+';
const ROUTE_LIST_DOCUMENTS = '/admin/list-documents';
const PARAM_ORG = 'org';
const PARAM_REPO = 'repo';
const PARAM_MODE = 'mode';
const MODE_VIEW = 'view';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit {
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
    url: this._fb.nonNullable.control('', [Validators.pattern(URL_PATTERN)]),
  });

  ngOnInit(): void {
    const org = this._route.snapshot.queryParamMap.get(PARAM_ORG);
    const repo = this._route.snapshot.queryParamMap.get(PARAM_REPO);
    const mode = this._route.snapshot.queryParamMap.get(PARAM_MODE);

    if (!org || !repo) {
      return;
    }

    this._currentOrg = org;
    this._currentRepo = repo;

    this.applyModeRestrictions(mode);
    this.loadResourceData(org, repo);
  }

  private applyModeRestrictions(mode: string | null): void {
    if (mode === MODE_VIEW) {
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
        this.$errorMessage.set('No se pudo cargar la información del recurso.');
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
        error: (err: { error?: { message?: string } }) => {
          this.$isSubmitting.set(false);
          this.$errorMessage.set(
            err?.error?.message ?? 'Error al actualizar el recurso de documentación.'
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
      error: (err: { error?: { message?: string } }) => {
        this.$isSubmitting.set(false);
        this.$errorMessage.set(
          err?.error?.message ?? 'Error al crear el recurso de documentación.'
        );
      },
    });
  }

  private handleSuccess(): void {
    this.$isSubmitting.set(false);
    this._router.navigate([ROUTE_LIST_DOCUMENTS]);
  }

  public onCancel(): void {
    this._router.navigate([ROUTE_LIST_DOCUMENTS]);
  }
}


------------------------------


<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="
      $isViewMode()
        ? 'Detalle del recurso de documentación'
        : $isEditMode()
        ? 'Editar recurso de documentación'
        : 'Crear recurso de documentación'
    "
    [$subtitle]="
      $isViewMode()
        ? 'Visualización en modo lectura'
        : $isEditMode()
        ? 'Actualizar información del repositorio'
        : 'Registrar nuevo repositorio'
    "
    [$backRoute]="'/admin/list-documents'"
  />

  @if ($errorMessage()) {
    <div class="form-alert form-alert-danger" role="alert">
      {{ $errorMessage() }}
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
            rows="4"
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
          [disabled]="$isSubmitting()"
        >
          {{ $isViewMode() ? 'Volver' : 'Cancelar' }}
        </nv-button>

        @if (!$isViewMode()) {
          <nv-button
            typeButton="primary"
            sizeButton="small"
            width="hug"
            (click)="onSubmit()"
            [disabled]="resourceForm.invalid || $isSubmitting()"
          >
            {{ $isSubmitting() ? 'Guardando...' : ($isEditMode() ? 'Actualizar recurso' : 'Guardar recurso') }}
          </nv-button>
        }
      </div>
    </form>
  </div>
</section>




-----------------------------------------




