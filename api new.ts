
export interface IDocumentationResource {
  repositoryName: string;
  organization: string;
  name?: string;
  description?: string;
  url?: string;
  lastSyncedAt?: string | null;
}

export interface ICreateResourcePayload {
  repositoryName: string;
  organization: string;
  name?: string;
  description?: string;
  url?: string;
}

export interface IUpdateResourcePayload {
  name?: string;
  description?: string;
  url?: string;
}



import {
  IDocumentationResource,
  ICreateResourcePayload,
  IUpdateResourcePayload,
} from '@core/models/documentation-resource.model';

// Dentro de DocumentationService:
private readonly _resourcesUrl = `${environment.apiBaseUrl}documentation/api/v1/resources`;

/** Listar todos los recursos */
public getResources(): Observable<IDocumentationResource[]> {
  return this._http.get<IDocumentationResource[]>(this._resourcesUrl).pipe(
    catchError(() => of([]))
  );
}

/** Obtener recurso por identidad compuesta */
public getResourceById(organization: string, repositoryName: string): Observable<IDocumentationResource> {
  return this._http.get<IDocumentationResource>(
    `${this._resourcesUrl}/${organization}/${repositoryName}`
  );
}

/** Crear recurso */
public createResource(payload: ICreateResourcePayload): Observable<IDocumentationResource> {
  return this._http.post<IDocumentationResource>(this._resourcesUrl, payload);
}

/** Actualizar recurso */
public updateResource(
  organization: string,
  repositoryName: string,
  payload: IUpdateResourcePayload
): Observable<IDocumentationResource> {
  return this._http.put<IDocumentationResource>(
    `${this._resourcesUrl}/${organization}/${repositoryName}`,
    payload
  );
}

/** Eliminar recurso */
public deleteResource(organization: string, repositoryName: string): Observable<void> {
  return this._http.delete<void>(
    `${this._resourcesUrl}/${organization}/${repositoryName}`
  );
}



import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { IDocumentationResource } from '@core/models/documentation-resource.model';

@Component({
  selector: 'app-list-documents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-documents.component.html',
  styleUrl: './list-documents.component.scss',
})
export class ListDocumentsComponent implements OnInit {
  private readonly _docService = inject(DocumentationService);

  public resources = signal<IDocumentationResource[]>([]);
  public isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadResources();
  }

  public loadResources(): void {
    this.isLoading.set(true);
    this._docService.getResources().subscribe({
      next: (data) => {
        this.resources.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  public onDelete(resource: IDocumentationResource): void {
    const confirmDelete = confirm(
      `¿Deseas eliminar el recurso ${resource.repositoryName} de ${resource.organization}?`
    );

    if (!confirmDelete) return;

    this._docService.deleteResource(resource.organization, resource.repositoryName).subscribe({
      next: () => {
        this.loadResources();
      },
    });
  }
}



<section class="bc-container bc-mt-5">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Recursos de Documentación</h2>
    <a routerLink="/admin/create-document" class="bc-btn bc-btn-primary">
      Nuevo Recurso
    </a>
  </div>

  @if (isLoading()) {
    <p>Cargando recursos...</p>
  } @else {
    <table class="bc-table">
      <thead>
        <tr>
          <th>Organización</th>
          <th>Repositorio</th>
          <th>Nombre Visible</th>
          <th>URL</th>
          <th>Última Sincronización</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (item of resources(); track item.organization + item.repositoryName) {
          <tr>
            <td>{{ item.organization }}</td>
            <td><strong>{{ item.repositoryName }}</strong></td>
            <td>{{ item.name ?? '-' }}</td>
            <td>
              @if (item.url) {
                <a [href]="item.url" target="_blank">{{ item.url }}</a>
              } @else {
                -
              }
            </td>
            <td>{{ item.lastSyncedAt ? (item.lastSyncedAt | date:'short') : 'Sin sincronizar' }}</td>
            <td>
              <button 
                class="bc-btn bc-btn-danger bc-btn-sm" 
                (click)="onDelete(item)">
                Eliminar
              </button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="6" class="text-center">No hay recursos de documentación registrados.</td>
          </tr>
        }
      </tbody>
    </table>
  }
</section>