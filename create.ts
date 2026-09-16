import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import {
  ICreateResourcePayload,
  IUpdateResourcePayload,
} from '@core/models/documentation-resource.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _docService = inject(DocumentationService);

  public isEditMode = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  private _currentOrg = '';
  private _currentRepo = '';

  public resourceForm: FormGroup = this._fb.group({
    organization: ['', [Validators.required]],
    repositoryName: ['', [Validators.required]],
    name: [''],
    description: [''],
    url: ['', [Validators.pattern('https?://.+')]],
  });

  ngOnInit(): void {
    const org = this._route.snapshot.queryParamMap.get('org');
    const repo = this._route.snapshot.queryParamMap.get('repo');

    if (org && repo) {
      this.isEditMode.set(true);
      this._currentOrg = org;
      this._currentRepo = repo;

      // La clave compuesta no se puede editar en un PUT
      this.resourceForm.get('organization')?.disable();
      this.resourceForm.get('repositoryName')?.disable();

      this.loadResourceData(org, repo);
    }
  }

  private loadResourceData(org: string, repo: string): void {
    this._docService.getResourceById(org, repo).subscribe({
      next: (resource) => {
        this.resourceForm.patchValue({
          organization: resource.organization,
          repositoryName: resource.repositoryName,
          name: resource.name ?? '',
          description: resource.description ?? '',
          url: resource.url ?? '',
        });
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la información del recurso.');
      },
    });
  }

  public onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    if (this.isEditMode()) {
      // 1. MODO ACTUALIZACIÓN (PUT)
      const updatePayload: IUpdateResourcePayload = {
        name: this.resourceForm.get('name')?.value?.trim() || undefined,
        description: this.resourceForm.get('description')?.value?.trim() || undefined,
        url: this.resourceForm.get('url')?.value?.trim() || undefined,
      };

      this._docService
        .updateResource(this._currentOrg, this._currentRepo, updatePayload)
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this._router.navigate(['/admin/list-documents']);
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(
              err?.error?.message ?? 'Error al actualizar el recurso de documentación.'
            );
          },
        });
    } else {
      // 2. MODO CREACIÓN (POST)
      const raw = this.resourceForm.getRawValue();
      const createPayload: ICreateResourcePayload = {
        organization: raw.organization.trim(),
        repositoryName: raw.repositoryName.trim(),
        name: raw.name?.trim() || undefined,
        description: raw.description?.trim() || undefined,
        url: raw.url?.trim() || undefined,
      };

      this._docService.createResource(createPayload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this._router.navigate(['/admin/list-documents']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err?.error?.message ?? 'Error al crear el recurso de documentación.'
          );
        },
      });
    }
  }

  public onCancel(): void {
    this._router.navigate(['/admin/list-documents']);
  }
}




///////////
.



<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="isEditMode() ? 'Editar recurso de documentación' : 'Crear recurso de documentación'"
    [$subtitle]="isEditMode() ? 'Actualizar información del repositorio' : 'Registrar nuevo repositorio'"
    [$backRoute]="'/admin/list-documents'"
  />

  @if (errorMessage()) {
    <div class="bc-alert bc-alert-danger bc-mb-4" role="alert">
      {{ errorMessage() }}
    </div>
  }

  <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()" class="bc-mt-4">
    <div class="bc-row">
      <!-- Organización (Obligatorio en create) -->
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

      <!-- Nombre del Repositorio (Obligatorio en create) -->
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
          placeholder="https://github.com/..."
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

    <!-- Acciones -->
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
        {{ isSubmitting() ? 'Guardando...' : (isEditMode() ? 'Actualizar recurso' : 'Guardar recurso') }}
      </button>
    </div>
  </form>
</section>




-----------3



public onOptionSelected(option: IEventSelectDocument, row: IRowDocument): void {
  this.$optionSelect.emit({ option, row });
}








-----------------


public optionSelected(event: any, document: IRowDocument): void {
  const selected = event?.optionSelected ?? event?.option?.optionSelected ?? event;
  const doc = event?.row ?? document;

  if (selected === 'OPT2') {
    // Confirmar eliminación
    this.documentToDelete = doc;
    this.$modalInformation.update((prev) => ({
      ...prev,
      paragraph: `¿Estás seguro de que deseas eliminar el recurso "${doc.repositoryName}"?`,
    }));
    this.modal()?.showModal();
  } else if (selected === 'OPT1' || selected === 'OPT3') {
    // Editar recurso
    this.router.navigate(['/admin/create-document'], {
      queryParams: {
        org: doc.organization,
        repo: doc.repositoryName,
      },
    });
  }
}









--------

// En list-documents.component.ts

public onTableOptionSelect(event: any): void {
  // Maneja si el evento viene empaquetado desde list-all-documents
  this.optionSelected(event.option ?? event, event.row ?? event.rowData);
}

public optionSelected(event: any, document: IRowDocument): void {
  // 1. Extraer la opción seleccionada (sea string o propiedad optionSelected / id)
  const option = event?.optionSelected ?? event?.id ?? event;
  
  // 2. Extraer la fila correcta
  const row = document ?? event?.rowData ?? event?.row;

  // OPT2: Eliminar
  if (option === EEventSelectItem.OPT2 || option === 'OPT2') {
    this.documentToDelete = row;
    this.$modalInformation.update((prev) => ({
      ...prev,
      paragraph: `¿Estás seguro de que deseas eliminar el recurso "${row.repositoryName}" de "${row.organization}"?`,
    }));
    this.modal()?.showModal();
    return;
  }

  // OPT3 (o OPT1): Editar
  if (option === EEventSelectItem.OPT3 || option === 'OPT3' || option === EEventSelectItem.OPT1 || option === 'OPT1') {
    this.router.navigate(['/admin/create-document'], {
      queryParams: {
        org: row.organization,
        repo: row.repositoryName,
      },
    });
  }
}





------------------


:host {
  display: block;
  width: 100%;
}

.form-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  margin-top: 1.5rem;
  box-sizing: border-box;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;

  &.form-group-full {
    grid-column: 1 / -1;
  }
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c2a29;
  margin-bottom: 0.5rem;

  .required {
    color: #e02424;
    font-weight: bold;
    margin-left: 2px;
  }
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.65rem 0.875rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2c2a29;
  background-color: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #fdc300;
    box-shadow: 0 0 0 3px rgba(253, 195, 0, 0.25);
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  &.is-invalid {
    border-color: #e02424;
    &:focus {
      box-shadow: 0 0 0 3px rgba(224, 36, 36, 0.25);
    }
  }
}

textarea.form-control {
  resize: vertical;
  min-height: 110px;
}

.feedback-error {
  display: block;
  font-size: 0.775rem;
  color: #e02424;
  margin-top: 0.35rem;
}

.form-alert {
  padding: 0.85rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &-danger {
    background-color: #fdf2f2;
    color: #9b1c1c;
    border: 1px solid #f8b4b4;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2f7;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #374151;

  &:hover:not(:disabled) {
    background-color: #d1d5db;
  }
}

.btn-save {
  background-color: #fdc300;
  color: #1f2937;

  &:hover:not(:disabled) {
    background-color: #e5b000;
  }
}


-*-------------


<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="isEditMode() ? 'Editar recurso de documentación' : 'Crear recurso de documentación'"
    [$subtitle]="isEditMode() ? 'Actualizar información del repositorio' : 'Registrar nuevo repositorio'"
    [$backRoute]="'/admin/list-documents'"
  />

  @if (errorMessage()) {
    <div class="form-alert form-alert-danger" role="alert">
      {{ errorMessage() }}
    </div>
  }

  <div class="form-card">
    <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        <!-- Organización -->
        <div class="form-group">
          <label class="form-label" for="organization">
            Organización <span class="required">*</span>
          </label>
          <input
            id="organization"
            type="text"
            formControlName="organization"
            class="form-control"
            [class.is-invalid]="resourceForm.get('organization')?.touched && resourceForm.get('organization')?.invalid"
            placeholder="ej. grupobancolombia-innersource"
          />
          @if (resourceForm.get('organization')?.touched && resourceForm.get('organization')?.hasError('required')) {
            <span class="feedback-error">La organización es requerida.</span>
          }
        </div>

        <!-- Nombre del Repositorio -->
        <div class="form-group">
          <label class="form-label" for="repositoryName">
            Nombre del Repositorio <span class="required">*</span>
          </label>
          <input
            id="repositoryName"
            type="text"
            formControlName="repositoryName"
            class="form-control"
            [class.is-invalid]="resourceForm.get('repositoryName')?.touched && resourceForm.get('repositoryName')?.invalid"
            placeholder="ej. NU5740001_Metrics_Doc"
          />
          @if (resourceForm.get('repositoryName')?.touched && resourceForm.get('repositoryName')?.hasError('required')) {
            <span class="feedback-error">El nombre del repositorio es requerido.</span>
          }
        </div>

        <!-- Nombre Visible -->
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

        <!-- URL de GitHub -->
        <div class="form-group">
          <label class="form-label" for="url">URL del repositorio</label>
          <input
            id="url"
            type="url"
            formControlName="url"
            class="form-control"
            [class.is-invalid]="resourceForm.get('url')?.touched && resourceForm.get('url')?.invalid"
            placeholder="https://github.com/..."
          />
          @if (resourceForm.get('url')?.touched && resourceForm.get('url')?.hasError('pattern')) {
            <span class="feedback-error">Debe ser una URL válida (http:// o https://).</span>
          }
        </div>

        <!-- Descripción (ancho completo) -->
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

      <!-- Acciones -->
      <div class="form-actions">
        <button
          type="button"
          class="btn-action btn-cancel"
          (click)="onCancel()"
          [disabled]="isSubmitting()"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="btn-action btn-save"
          [disabled]="resourceForm.invalid || isSubmitting()"
        >
          {{ isSubmitting() ? 'Guardando...' : (isEditMode() ? 'Actualizar recurso' : 'Guardar recurso') }}
        </button>
      </div>
    </form>
  </div>
</section>