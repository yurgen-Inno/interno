import {
  Component,
  computed,
  inject,
  signal,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { GlobalStoreService } from '@core/services/store/global-store.service';
import { IDocumentationResource } from '@core/models/documentation-resource.model';
import {
  ModalConfig,
  TransactionStatus,
} from '@core/models/modal.model'; // Ajustar ruta según tu index de models
import {
  MODAL_CONFIRM_DELETE_DOCUMENT,
  MODAL_DELETE_DOCUMENT,
  MODAL_ERROR_DOCUMENT,
  TABLE_DOCUMENT_OPTIONS,
  TABLE_OPTIONS_DOCUMENTS,
} from '@core/constants/documents.constant'; // Ajustar ruta de constantes

// Componentes standalone según tu arquitectura de imports
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ListAllDocumentsComponent } from './components/list-all-documents/list-all-documents.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BcOffCanvasModule } from '@bancolombia/design-system-web';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SkeletonGridComponent } from '@shared/components/skeleton-grid/skeleton-grid.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';

@Component({
  selector: 'app-list-documents',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ListAllDocumentsComponent,
    ButtonComponent,
    BcOffCanvasModule,
    ModalComponent,
    SkeletonGridComponent,
    ErrorStateComponent,
  ],
  templateUrl: './list-documents.component.html',
  styleUrl: './list-documents.component.scss',
})
export class ListDocumentsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly _eventsService = inject(EventsService);
  private readonly _documentationService = inject(DocumentationService);
  private readonly _globalStoreService = inject(GlobalStoreService);

  public modal = viewChild<ModalComponent>('modal');
  public destroy$: Subject<void> = new Subject<void>();

  public offCanvasComponent = viewChild<{
    openOffCanvas: () => void;
    closeOffCanvas: () => void;
  }>('offCanvas');

  // 1. Consulta reactiva con la nueva API de recursos
  public resourceDocuments = rxResource({
    stream: () => this._documentationService.getResources(),
    defaultValue: [] as IDocumentationResource[],
  });

  // 2. Mapeo para la tabla manteniendo las opciones del menú contextual
  public readonly $documentsViewModels = computed(() => {
    return this.resourceDocuments.value().map((data) => {
      const menu = TABLE_OPTIONS_DOCUMENTS;
      return { ...data, menu };
    });
  });

  // 3. Manejo de estado para borrado por identidad compuesta
  public documentToDelete: IDocumentationResource | null = null;
  public cellOption: any = TABLE_DOCUMENT_OPTIONS;

  public $modalInformation = signal<ModalConfig>({
    size: 'sm',
    title: 'Confirmar eliminación',
    isDynamicContentEnable: false,
    paragraph: '¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.',
    buttons: {
      enabled: true,
      orientation: 'horizontal',
      buttonsList: [
        {
          id: 'cancel',
          label: 'Cancelar',
          type: 'secondary',
        },
        {
          id: 'accept',
          label: 'Aceptar',
          type: 'primary',
        },
      ],
    },
    status: {
      enabled: true,
      type: TransactionStatus.info,
    },
  });

  // 4. Permisos RBAC
  public readonly $permissionCreate = computed(() => {
    const userPermissions = (this._globalStoreService.selector('PERMISSIONS')() as any[]) ?? [];
    return (window as any).PermissionsEngine?.evaluate(
      'PERMISSION_DOCUMENTS_CREATE',
      userPermissions
    ) ?? true;
  });

  ngOnInit(): void {
    this.sendEvent();
  }

  private sendEvent(): void {
    this._eventsService
      .sendEvent('documents_management_view', {
        start_session: new Date().toISOString(),
      })
      ?.subscribe();
  }

  public goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  public closedDialog(resource: IDocumentationResource | null): void {
    this.offCanvasComponent()?.closeOffCanvas();

    if (resource) {
      this._eventsService
        .sendEvent('create-document', {
          id: resource.repositoryName,
          region: resource.organization,
        })
        ?.subscribe();

      this.modal()?.showModal();
      this.$modalInformation.update((prev) => ({
        ...prev,
        title: 'Recurso creado',
        paragraph: `El recurso "${resource.repositoryName}" ha sido creado exitosamente.`,
        buttons: undefined,
        status: { enabled: true, type: TransactionStatus.success },
      }));

      this.resourceDocuments.reload();
    }
  }

  // 5. Eliminación utilizando { organization, repositoryName }
  public deleteDocument(document: IDocumentationResource, buttonId: string): void {
    this._documentationService
      .deleteResource(document.organization, document.repositoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._eventsService
            .sendEvent('delete-resource', {
              id: document.repositoryName,
              region: document.organization,
            })
            ?.subscribe();

          this.openModal(document, buttonId, MODAL_DELETE_DOCUMENT);
          this.resourceDocuments.reload();
        },
        error: () => {
          this._eventsService
            .sendEvent('error-delete-resource', {
              id: document.repositoryName,
              region: document.organization,
            })
            ?.subscribe();

          this.openModal(document, buttonId, MODAL_ERROR_DOCUMENT, true);
        },
      });
  }

  private openModal(
    document: IDocumentationResource,
    _buttonId: string,
    modalConfig: Partial<ModalConfig>,
    isError = false
  ): void {
    this.$modalInformation.update((prev) => ({
      ...prev,
      ...modalConfig,
      paragraph: isError
        ? `No se pudo eliminar el recurso "${document.repositoryName}". Por favor, intenta nuevamente.`
        : `El recurso "${document.repositoryName}" ha sido eliminado exitosamente.`,
    }));
    this.modal()?.showModal();
  }

  public handleModalAction(buttonId: string): void {
    if (buttonId === 'accept' && this.documentToDelete) {
      this.deleteDocument(this.documentToDelete, buttonId);
    }
    this.modal()?.handleClose(`button-${buttonId}`);
  }

  public onTableOptionSelect({ option, row }: any): void {
    this.optionSelected(option, row);
  }

  public optionSelected(event: any, document: IDocumentationResource): void {
    // Evento OPT2: Modal de Confirmar Eliminación
    if (event.optionSelected === 'OPT2' || event === 'OPT2') {
      this.documentToDelete = document;
      this.$modalInformation.update((prev) => ({
        ...prev,
        ...MODAL_CONFIRM_DELETE_DOCUMENT,
        paragraph: `¿Estás seguro de que deseas eliminar el recurso "${document.repositoryName}" de "${document.organization}"? Esta acción no se puede deshacer.`,
      }));
      this.modal()?.showModal();
    } 
    // Evento OPT3: Abrir OffCanvas (detalle / edición posterior)
    else if (event.optionSelected === 'OPT3' || event === 'OPT3') {
      const data = event.rowData ?? document;
      if (data.menu) delete data.menu;
      this.offCanvasComponent()?.openOffCanvas();
    }
  }

  public goToCreateNewDocument(): void {
    this.router.navigate(['/admin/create-document']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { ICreateResourcePayload } from '@core/models/documentation-resource.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ButtonComponent } from '@shared/components/button/button.component';

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
export class CreateDocumentComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _docService = inject(DocumentationService);

  public isSubmitting = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  // Formulario según los campos exigidos por la API /resources
  public resourceForm: FormGroup = this._fb.group({
    organization: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
    repositoryName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
    name: [''],
    description: [''],
    url: ['', [Validators.pattern('https?://.+')]],
  });

  public onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload: ICreateResourcePayload = {
      organization: this.resourceForm.value.organization.trim(),
      repositoryName: this.resourceForm.value.repositoryName.trim(),
      name: this.resourceForm.value.name?.trim() || undefined,
      description: this.resourceForm.value.description?.trim() || undefined,
      url: this.resourceForm.value.url?.trim() || undefined,
    };

    this._docService.createResource(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this._router.navigate(['/admin/list-documents']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Ocurrió un error al crear el recurso de documentación.'
        );
      },
    });
  }

  public onCancel(): void {
    this._router.navigate(['/admin/list-documents']);
  }
}



<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="'Crear recurso de documentación'"
    [$subtitle]="'Registrar nuevo repositorio'"
    [$backRoute]="'/admin/list-documents'"
  />

  @if (errorMessage()) {
    <div class="bc-alert bc-alert-danger bc-mb-4" role="alert">
      {{ errorMessage() }}
    </div>
  }

  <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()" class="bc-mt-4">
    <div class="bc-row">
      <!-- Organización (Obligatorio) -->
      <div class="bc-col-12 bc-col-md-6 bc-mb-3">
        <label class="bc-label" for="organization">Organización *</label>
        <input
          id="organization"
          type="text"
          formControlName="organization"
          class="bc-input"
          placeholder="ej. grupobancolombia-innersource"
        />
        @if (resourceForm.get('organization')?.touched && resourceForm.get('organization')?.hasError('required')) {
          <small class="bc-text-danger">La organización es requerida.</small>
        }
      </div>

      <!-- Nombre del Repositorio (Obligatorio) -->
      <div class="bc-col-12 bc-col-md-6 bc-mb-3">
        <label class="bc-label" for="repositoryName">Nombre del Repositorio *</label>
        <input
          id="repositoryName"
          type="text"
          formControlName="repositoryName"
          class="bc-input"
          placeholder="ej. NU5740001_Metrics_Doc"
        />
        @if (resourceForm.get('repositoryName')?.touched && resourceForm.get('repositoryName')?.hasError('required')) {
          <small class="bc-text-danger">El nombre del repositorio es requerido.</small>
        }
      </div>

      <!-- Nombre Visible -->
      <div class="bc-col-12 bc-col-md-6 bc-mb-3">
        <label class="bc-label" for="name">Nombre visible</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          class="bc-input"
          placeholder="ej. Documentación Métricas Corporativas"
        />
      </div>

      <!-- URL del Repositorio -->
      <div class="bc-col-12 bc-col-md-6 bc-mb-3">
        <label class="bc-label" for="url">URL de GitHub</label>
        <input
          id="url"
          type="url"
          formControlName="url"
          class="bc-input"
          placeholder="https://github.com/grupobancolombia-innersource/..."
        />
        @if (resourceForm.get('url')?.touched && resourceForm.get('url')?.hasError('pattern')) {
          <small class="bc-text-danger">Debe ser una URL válida (http:// o https://).</small>
        }
      </div>

      <!-- Descripción -->
      <div class="bc-col-12 bc-mb-3">
        <label class="bc-label" for="description">Descripción</label>
        <textarea
          id="description"
          formControlName="description"
          class="bc-textarea"
          rows="3"
          placeholder="Descripción del propósito de la documentación..."
        ></textarea>
      </div>
    </div>

    <!-- Botonera de acciones -->
    <div class="bc-mt-4 d-flex justify-content-end gap-3">
      <button
        type="button"
        class="bc-btn bc-btn-secondary"
        (click)="onCancel()"
        [disabled]="isSubmitting()">
        Cancelar
      </button>

      <button
        type="submit"
        class="bc-btn bc-btn-primary"
        [disabled]="resourceForm.invalid || isSubmitting()">
        {{ isSubmitting() ? 'Guardando...' : 'Guardar recurso' }}
      </button>
    </div>
  </form>
</section>


<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="'Recursos de Documentación'"
    [$subtitle]="'Configuración de repositorios fuente'"
    [$backRoute]="'/dashboard'"
    [$actionLabel]="'Agregar nuevo recurso'"
    [$permissionButton]="$permissionCreate()"
    ($actionClick)="goToCreateNewDocument()"
  />

  @if (resourceDocuments.isLoading()) {
    <app-skeleton-grid
      [$count]="'1'"
      [$type]="'square'"
      [$width]="'1200'"
      [$height]="'800'"
    />
  } @else if (resourceDocuments.error()) {
    <app-error-state
      [$message]="'No se obtuvieron los recursos de documentación'"
      ($retry)="resourceDocuments.reload()"
    />
  } @else if (resourceDocuments.value().length > 0) {
    <app-list-all-documents
      [$data]="$documentsViewModels()"
      [$cellOptions]="cellOption"
      ($optionSelect)="onTableOptionSelect($event)"
    />
  } @else {
    <div class="bc-row bc-justify-content-center bc-align-items-center bc-flex-column bc-gap-4 bc-py-5">
      <em class="bc-icon">empty</em>
      <h2>No hay recursos registrados</h2>
      <p>No se encontraron repositorios de documentación configurados.</p>
      
      <nv-button
        typeButton="primary"
        sizeButton="small"
        width="hug"
        routerLink="/admin/create-document"
      >
        Crear tu primer recurso
      </nv-button>
    </div>
  }
</section>

<!-- Modal de confirmación para eliminar -->
<nv-modal
  #modal
  [backdropClose]="'true'"
  [modalConfig]="$modalInformation()"
  (buttonSelect)="handleModalAction($event)"
>
  <div modalContent>
    <p>{{ $modalInformation().paragraph }}</p>
  </div>
</nv-modal>