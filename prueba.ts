
<div class="projects-container">
  <!-- Estado de Carga -->
  @if (isLoading()) {
    <div class="projects-loading-state bc-d-flex bc-align-items-center bc-justify-content-center bc-p-4">
      <div class="bc-spinner"></div>
      <span class="bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500 bc-m-0" style="margin-left: 10px !important;">
        Cargando proyectos...
      </span>
    </div>
  }

  <!-- Estado de Error -->
  @if (error(); as errMessage) {
    <div class="bc-d-flex bc-align-items-center bc-justify-content-center bc-p-3 bc-border-radius-2-full" style="background-color: #fef2f2; border: 1px solid #fee2e2; margin-bottom: 12px;">
      <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-complementary-01">
        {{ errMessage }}
      </p>
    </div>
  }

  <!-- Lista Dinámica de Proyectos Consumidos del Servicio -->
  @if (!isLoading()) {
    <div class="projects-list">
      @for (project of projects(); track project.applicationCode) {
        <nv-card-container
          cardType="stroke-1"
          otherClass="bc-w-100 bc-card bc-bg-white bc-border-radius-2-full bc-p-4 bc-d-flex bc-flex-row bc-justify-content-between bc-align-items-center bc-gap-4 project-card-hover"
        >
          <!-- Izquierda: Nombre del Proyecto (applicationCode) y Duración / Filial -->
          <div class="bc-d-flex bc-flex-column bc-gap-1">
            <h3 class="bc-m-0 bc-opensans-font-style-4-bold">
              {{ project.applicationCode }}
            </h3>
            <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
              {{ project.duration || project.filial || 'Sin información de periodo' }}
            </p>
          </div>

          <!-- Derecha: Puntaje, Rango (nv-status) y Acción Ver Detalle -->
          <div class="bc-d-flex bc-align-items-center bc-gap-3">
            <!-- Score Pill -->
            <div class="score-pill">
              {{ project.scoreProject | number:'1.2-2' }}
            </div>

            <!-- Rango con nv-status oficial -->
            <nv-status
              [color]="project.levelProject | findTextColor"
              [border]="'center'"
              [customIcon]="project.levelProject | defineIcon"
              [text]="project.levelProject"
              [radius]="'radius-16'"
              data-testid="nv-status-senior"
            />

            <!-- Botón Ver Detalle -->
            <button type="button" class="btn-detail" (click)="onSelectProject(project)">
              <span class="btn-detail-text">Ver detalle</span>
              <svg class="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </nv-card-container>
      } @empty {
        <div class="bc-d-flex bc-flex-column bc-align-items-center bc-justify-content-center bc-p-4 bc-bg-white bc-border-radius-2-full">
          <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
            No se encontraron proyectos registrados para este desarrollador.
          </p>
        </div>
      }
    </div>

    <!-- Paginación Dinámica (Se muestra solo si hay elementos) -->
    @if (totalCount() > 0) {
      <div class="projects-pagination">
        <!-- Rango de elementos -->
        <div class="pagination-info">
          Mostrando {{ startRange() }}-{{ endRange() }} de {{ totalCount() }} elementos
        </div>

        <!-- Controles de navegación -->
        <div class="pagination-nav">
          <button 
            type="button" 
            class="nav-btn" 
            [disabled]="currentPage() === 1" 
            (click)="prevPage()"
            aria-label="Página anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <span class="page-number">{{ currentPage() }}</span>

          <button 
            type="button" 
            class="nav-btn" 
            [disabled]="currentPage() >= totalPages()" 
            (click)="nextPage()"
            aria-label="Página siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Selector de tamaño de página -->
        <div class="page-size-wrapper">
          <select 
            class="page-size-select" 
            [value]="pageSize()" 
            (change)="onPageSizeChange($event)"
          >
            @for (opt of pageSizeOptions; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
          <svg class="select-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    }
  }
</div>

========================================================================== end HTML


@use '../../../styles/tokens' as *;

:host {
  display: block;
  width: 100%;
}

.projects-container {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.bc-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #FDDA24;
  border-radius: 50%;
  animation: bc-spin 0.8s linear infinite;
}

@keyframes bc-spin {
  to { transform: rotate(360deg); }
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// Single Project Card Hover
.project-card-hover {
  transition: all 0.2s ease !important;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    border-color: #cbd5e1 !important;
  }
}

.project-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
}

// Left side info
.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-name {
  font-size: 0.9375rem; // ~15px
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.project-duration {
  font-size: 0.8125rem; // ~13px
  color: #64748b;
  font-weight: 400;
}

// Right side actions
.project-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
}

// Score Pill (Light Blue/Cyan)
.score-pill {
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 9999px;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

// Seniority Badge (Yellow/Amber with Medal Icon)
.seniority-badge {
  background-color: #fef08a;
  color: #854d0e;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.seniority-icon {
  width: 14px;
  height: 14px;
  color: #854d0e;
  flex-shrink: 0;
}

// Ver Detalle button
.btn-detail {
  background: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #0f172a;
    background-color: #f1f5f9;

    .chevron-icon {
      transform: translateX(2px);
    }
  }
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: transform 0.2s ease;
}

// Pagination Footer
.projects-pagination {
  margin-top: 24px;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 14px;
  }
}

.pagination-info {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 400;
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.page-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 20px;
  text-align: center;
}

// Page Size Select
.page-size-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.page-size-select {
  appearance: none;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 28px 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #94a3b8;
  }

  &:focus {
    border-color: #0284c7;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
  }
}

.select-arrow {
  position: absolute;
  right: 8px;
  width: 16px;
  height: 16px;
  color: #64748b;
  pointer-events: none;
}


========================================================= end css

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TGenericType } from '@core/models/general.model';
import { IAuthors, IAuthorsResults } from '@core/models/seniority.model';
import { SeniorityService } from '@core/services/seniority.service';
import { NvCardContainerComponent } from '@shared/design-system/nv-card-container/nv-card-container.component';
import { NvStatusComponent } from '@shared/design-system/nv-status/nv-status.component';
import { FindTextColorPipe, DefineIconPipe } from '@shared/pipes/seniority.pipes';

@Component({
  selector: 'app-list-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    NvCardContainerComponent,
    NvStatusComponent,
    FindTextColorPipe,
    DefineIconPipe
  ],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProjects implements OnInit, OnChanges {
  private _seniorityService = inject(SeniorityService);

  /**
   * Correo del desarrollador para consultar sus proyectos dinámicamente
   */
  @Input() email: string = 'lgordo@bancolombia.com.co';

  /**
   * Filtros opcionales para la petición a la API
   */
  @Input() filters: Record<string, TGenericType> = {};

  /**
   * Permite inyectar directamente la respuesta de IAuthors en caso de que
   * el componente padre ya haya resuelto la petición HTTP
   */
  @Input() set authorsData(data: IAuthors | undefined) {
    if (data) {
      this.projects.set(data.results || []);
      this.totalCount.set(data.count ?? (data.results?.length || 0));
      this.currentPage.set(data.page || 1);
      this.pageSize.set(data.size || 10);
    }
  }

  @Output() viewDetail = new EventEmitter<IAuthorsResults>();

  // Estado reactivo (sin datos quemados/mockeados)
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  projects = signal<IAuthorsResults[]>([]);
  totalCount = signal<number>(0);

  // Paginación
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizeOptions = [5, 10, 20, 50];

  // Rangos calculados dinámicamente
  startRange = computed(() => {
    if (this.totalCount() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endRange = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
  });

  ngOnInit(): void {
    if (this.email && this.projects().length === 0) {
      this.loadProjects();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && !changes['email'].firstChange) {
      this.currentPage.set(1);
      this.loadProjects();
    }
  }

  /**
   * Consulta el servicio getAllDevelopers consumiendo la API de manera dinámica
   */
  public loadProjects(): void {
    if (!this.email) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const queryFilters: Record<string, TGenericType> = {
      ...this.filters,
      page: this.currentPage(),
      size: this.pageSize()
    };

    this._seniorityService.getAllDevelopers(this.email, queryFilters).subscribe({
      next: (response: IAuthors) => {
        this.projects.set(response?.results || []);
        this.totalCount.set(response?.count ?? (response?.results?.length || 0));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al obtener la lista de proyectos');
        this.isLoading.set(false);
      }
    });
  }

  public prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProjects();
    }
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadProjects();
    }
  }

  public onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(1);
    this.loadProjects();
  }

  public onSelectProject(project: IAuthorsResults): void {
    this.viewDetail.emit(project);
  }
}


====================================================== end typescript


import { Injectable } from '@angular/core';
import {
  IAuthors,
  IAuthorsResults,
  IListCodes,
  IListCodesResponse,
  IResponseAuthors,
  IResponsePersonalSeniority
} from '@core/models/seniority.model';

@Injectable({
  providedIn: 'root'
})
export class AdapterSeniorityService {
  mapPersonalSeniority(response: IResponsePersonalSeniority[]): IResponsePersonalSeniority {
    return response?.[0] || ({} as IResponsePersonalSeniority);
  }

  mapListCodes(values: IListCodesResponse): IListCodes {
    return {
      count: values?.count || 0,
      results: (values?.data || []).map(d => ({
        applicationCode: d.applicationCode,
        filial: d.filial
      })),
      page: values?.page || 1,
      size: values?.size || 10
    };
  }

  mapListAuthors(values: IResponseAuthors): IAuthors {
    const results: IAuthorsResults[] = (values?.data || []).map(item => ({
      applicationCode: item.applicationCode,
      authorEmail: item.authorEmail,
      deltaScoreProject: item.deltaScoreProject,
      directionScoreProject: item.directionScoreProject || 'up',
      filial: item.filial || '',
      levelProject: item.levelProject,
      scorePreviousProject: item.scorePreviousProject,
      scoreProject: item.scoreProject,
      duration: item.duration || '12 meses'
    }));

    return {
      count: values?.count ?? results.length,
      results,
      page: values?.page || 1,
      size: values?.size || 10
    };
  }
}


========================================================= end adapter-seniority.service.ts


import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TGenericType } from '@core/models/general.model';
import {
  IAuthors,
  IListCodes,
  IListCodesResponse,
  IResponseAuthors,
  IResponsePersonalSeniority,
} from '@core/models/seniority.model';
import { EventsService } from '@core/services/events/events.service';
import { environment } from '@environments/environment';
import { buildApiUrl } from '@shared/utils/build-api-url';
import { AdapterSeniorityService } from './adapter/adapter-seniority.service';
import { catchError, delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeniorityService {
  private _http = inject(HttpClient);
  private _adapterSeniority = inject(AdapterSeniorityService);
  private _eventsService = inject(EventsService);

  /**
   * Bandera para simular la data con RxJS `of` y no detenerse por la API real.
   * Cambiar a `false` para realizar peticiones HTTP reales a la API.
   */
  public useSimulation = true;

  public getPersonalSeniority(
    email: string | undefined
  ): Observable<IResponsePersonalSeniority> {
    if (!email) {
      throw new Error('Email is required');
    }

    if (this.useSimulation) {
      const mockPersonal: IResponsePersonalSeniority = {
        authorEmail: email,
        userName: 'Luis Eduardo Gordo',
        filial: 'cde',
        position: 325,
        valueTotal: '100',
        value: '79.72',
        icon: 'up',
        level: 'Semi Senior',
        previousLevel: 'Semi Senior',
        previousPosition: '340',
        score: 79.72,
        previousScore: 75.10,
        deltaScore: 4.62,
        direction: 'up',
        evcId: 'evc-01',
        evcName: 'Célula Producto Digital · Fábrica de software',
        typeAuthor: 'Developer',
        dimConsistencia: 80,
        dimCalidad: 82,
        dimIa: 75,
        diasConDatos: 30,
        metricas: {} as any,
        comparisonMeta: {} as any
      };
      return of(mockPersonal).pipe(delay(200));
    }

    return this._http
      .get<IResponsePersonalSeniority[]>(
        `${environment.apiBaseUrl}query/api/v1/authors/${encodeURIComponent(email)}`
      )
      .pipe(
        map((response: IResponsePersonalSeniority[]) =>
          this._adapterSeniority.mapPersonalSeniority(response)
        ),
        catchError(error => {
          this._eventsService
            .sendEvent('error_load_seniority', { error })
            .subscribe();
          return of({} as IResponsePersonalSeniority);
        })
      );
  }

  public getAllProjectsList(
    email: string | undefined,
    emailDeveloper: string | undefined,
    filters: Record<string, TGenericType>
  ): Observable<IListCodes> {
    if (!email || !emailDeveloper) {
      throw new Error('Email is required');
    }

    if (this.useSimulation) {
      const mockCodes: IListCodesResponse = {
        count: 2,
        data: [
          {
            applicationCode: 'Vultracker',
            authorEmail: emailDeveloper,
            filial: 'cde',
            deltaScoreProject: null,
            directionScoreProject: 'up',
            levelPreviousProject: null,
            levelProject: 'Senior',
            scorePreviousProject: null,
            scoreProject: 88.50,
            subIndicadores: null
          },
          {
            applicationCode: 'Nebula',
            authorEmail: emailDeveloper,
            filial: 'cde',
            deltaScoreProject: null,
            directionScoreProject: 'up',
            levelPreviousProject: null,
            levelProject: 'Semi Senior',
            scorePreviousProject: null,
            scoreProject: 72.30,
            subIndicadores: null
          }
        ],
        page: Number(filters?.['page']) || 1,
        size: Number(filters?.['size']) || 10
      };
      return of(this._adapterSeniority.mapListCodes(mockCodes)).pipe(delay(200));
    }

    const url = buildApiUrl(
      `${environment.apiBaseUrl}query/api/v1/projects/${encodeURIComponent(email)}`,
      filters
    );

    return this._http.get<IListCodesResponse>(url).pipe(
      map(values => this._adapterSeniority.mapListCodes(values)),
      catchError(error => {
        this._eventsService
          .sendEvent('error_load_codes', { error })
          .subscribe();
        return of({} as unknown as IListCodes);
      })
    );
  }

  public getAllDevelopers(
    email: string | undefined,
    filters: Record<string, TGenericType>
  ): Observable<IAuthors> {
    if (!email) {
      throw new Error('Email is required');
    }

    // =========================================================================
    // Simulación con RxJS of() para pruebas locales sin bloqueo de API
    // =========================================================================
    if (this.useSimulation) {
      const simulatedResponse: IResponseAuthors = {
        count: 2,
        page: Number(filters?.['page']) || 1,
        size: Number(filters?.['size']) || 10,
        data: [
          {
            applicationCode: 'Vultracker',
            authorEmail: email,
            deltaScoreProject: null,
            directionScoreProject: 'up',
            filial: 'cde',
            levelPreviousProject: null,
            levelProject: 'Senior',
            scorePreviousProject: null,
            scoreProject: 88.50,
            duration: '14 meses',
            subIndicadores: {
              builds: { actual: 95, anterior: 90, delta: 5, direction: 'up' },
              debtIssues: { actual: 2, anterior: 4, delta: -2, direction: 'up' },
              linesPerIssue: { actual: 120, anterior: 150, delta: -30, direction: 'up' },
              rework: { actual: 3, anterior: 5, delta: -2, direction: 'up' }
            }
          },
          {
            applicationCode: 'Nebula',
            authorEmail: email,
            deltaScoreProject: null,
            directionScoreProject: 'up',
            filial: 'cde',
            levelPreviousProject: null,
            levelProject: 'Semi Senior',
            scorePreviousProject: null,
            scoreProject: 72.30,
            duration: '8 meses',
            subIndicadores: {
              builds: { actual: 80, anterior: 75, delta: 5, direction: 'up' },
              debtIssues: { actual: 5, anterior: 6, delta: -1, direction: 'up' },
              linesPerIssue: { actual: 200, anterior: 210, delta: -10, direction: 'up' },
              rework: { actual: 6, anterior: 8, delta: -2, direction: 'up' }
            }
          }
        ]
      };

      return of(this._adapterSeniority.mapListAuthors(simulatedResponse)).pipe(delay(300));
    }

    // =========================================================================
    // Llamado HTTP Real a la API
    // =========================================================================
    const url = buildApiUrl(
      `${environment.apiBaseUrl}query/api/v1/projects/${email}`,
      filters
    );

    return this._http.get<IResponseAuthors>(url).pipe(
      map(values => this._adapterSeniority.mapListAuthors(values)),
      catchError(error => {
        this._eventsService
          .sendEvent('error_load_authors', { error })
          .subscribe();
        return of({} as unknown as IAuthors);
      })
    );
  }
}


=============================================================== service.seniority.ts


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findTextColor',
  standalone: true
})
export class FindTextColorPipe implements PipeTransform {
  transform(level: string | undefined): string {
    switch (level?.toLowerCase()) {
      case 'senior':
      case 'lead':
        return '#854d0e';
      case 'semi senior':
      case 'semisenior':
      case 'ssr':
        return '#854d0e';
      case 'junior':
      case 'jr':
        return '#0369a1';
      default:
        return '#334155';
    }
  }
}

@Pipe({
  name: 'defineIcon',
  standalone: true
})
export class DefineIconPipe implements PipeTransform {
  transform(level: string | undefined): string {
    switch (level?.toLowerCase()) {
      case 'senior':
      case 'lead':
        return '🏆';
      case 'semi senior':
      case 'semisenior':
      case 'ssr':
        return '⭐';
      case 'junior':
      case 'jr':
        return '🌱';
      default:
        return '🎖️';
    }
  }
}


========================================================= end pipe
