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