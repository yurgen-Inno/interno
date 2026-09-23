    @let projectsList = $projects();
    @let loading = $isLoading();

    <!-- CONTENEDOR GENERAL (Recuadro rojo exterior) -->
    <section class="bc-d-flex bc-flex-column bc-gap-3 bc-w-100">
      
      <!-- CONTENEDOR BASE DE LA LISTA DE CARDS -->
      <div class="bc-d-flex bc-flex-column bc-gap-3 bc-w-100 bc-border bc-border-brand-sequential-N-200 bc-border-radius-2-full bc-p-4 bc-bg-white">
        
        <!-- ESTADO DE CARGA -->
        @if (loading) {
          <div class="bc-d-flex bc-align-items-center bc-justify-content-center bc-p-4 bc-gap-2">
            <span class="bc-opensans-font-style-2-regular bc-text-brand-sequential-N-400">
              Cargando proyectos asignados...
            </span>
          </div>
        } @else {
          
          <!-- ITERACIÓN DINÁMICA: Crea una card por cada proyecto del usuario sin duplicar código -->
          @for (project of projectsList; track project.id) {
            
            <nv-card-container
              cardType="stroke-1"
              otherClass="bc-w-100 bc-card bc-bg-white bc-border-radius-2-full bc-p-3 bc-d-flex bc-flex-row bc-justify-content-between bc-align-items-center bc-gap-3 project-card-item"
              data-testid="nv-project-card">
              
              <!-- SECCIÓN IZQUIERDA: Nombre del Proyecto y Duración -->
              <div class="bc-d-flex bc-flex-column bc-gap-1">
                <h4 class="bc-m-0 bc-opensans-font-style-4-bold bc-text-brand-primary-00">
                  {{ project.name }}
                </h4>
                <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
                  {{ project.durationText ?? (project.durationMonths + ' meses') }}
                </p>
              </div>

              <!-- SECCIÓN DERECHA: Badge de Score, Seniority con <nv-status>, Ícono y Acción -->
              <div class="bc-d-flex bc-align-items-center bc-gap-3">
                
                <!-- Badge de Calificación (Azul Celeste Caribe) -->
                <span class="bc-d-inline-flex bc-align-items-center bc-justify-content-center bc-border-radius-1-full bc-opensans-font-style-2-semibold bc-score-badge">
                  {{ project.score | number:'1.2-2' }}
                </span>

                <!-- Componente Nativo Caribe: nv-status para el Nivel de Seniority -->
                <nv-status
                  [color]="project.seniorityLevel | findTextColor"
                  [border]="'center'"
                  [customIcon]="project.seniorityLevel | defineIcon"
                  [text]="project.seniorityLevel"
                  [radius]="'radius-16'"
                  data-testid="nv-status-project-level">
                </nv-status>

                <!-- Ícono decorativo / de tiempo -->
                <div class="bc-d-flex bc-align-items-center bc-text-brand-sequential-N-400">
                  <svg class="bc-icon-clock" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke-width="1.8"></circle>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 7v5l3 2"></path>
                  </svg>
                </div>

                <!-- Botón de acción 'Ver detalle >' -->
                <button
                  type="button"
                  (click)="onOpenDetail(project)"
                  class="bc-btn-detail bc-d-inline-flex bc-align-items-center bc-gap-1 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500 hover:bc-text-brand-primary-00"
                  aria-label="Ver detalle del proyecto">
                  <span>Ver detalle</span>
                  <span class="bc-opensans-font-style-2-bold">&rsaquo;</span>
                </button>

              </div>

            </nv-card-container>

          } @empty {
            <div class="bc-d-flex bc-justify-content-center bc-align-items-center bc-p-4">
              <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-400">
                No hay proyectos registrados para este colaborador.
              </p>
            </div>
          }

        }

        <!-- =================================================================== -->
        <!-- PIE DE CONTENEDOR: Paginación y Selector con clases Caribe          -->
        <!-- =================================================================== -->
        <footer class="bc-d-flex bc-flex-row bc-justify-content-between bc-align-items-center bc-pt-3 bc-border-top bc-border-brand-sequential-N-200">
          
          <!-- Resumen de elementos y botones de navegación -->
          <div class="bc-d-flex bc-align-items-center bc-gap-4">
            <span class="bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
              Mostrando {{ $startRecord() }}-{{ $endRecord() }} de {{ $totalElements() }} elementos
            </span>

            <!-- Control de páginas anterior / siguiente -->
            <div class="bc-d-flex bc-align-items-center bc-gap-2 bc-bg-brand-sequential-N-100 bc-border-radius-1-full bc-p-1">
              <button 
                type="button"
                (click)="onPreviousPage()"
                [disabled]="$currentPage() <= 1"
                class="bc-pagination-btn bc-d-flex bc-align-items-center bc-justify-content-center"
                aria-label="Página anterior">
                <svg class="bc-pagination-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span class="bc-opensans-font-style-2-bold bc-text-brand-primary-00 bc-pagination-current">
                {{ $currentPage() }}
              </span>

              <button 
                type="button"
                (click)="onNextPage()"
                [disabled]="$currentPage() >= $totalPages()"
                class="bc-pagination-btn bc-d-flex bc-align-items-center bc-justify-content-center"
                aria-label="Página siguiente">
                <svg class="bc-pagination-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Selector de cantidad de registros por página -->
          <div class="bc-d-flex bc-align-items-center bc-border bc-border-brand-sequential-N-200 bc-border-radius-2-full bc-p-2 bc-gap-2 bc-bg-white">
            <span class="bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
              {{ $pageSize() }} por página
            </span>
            <svg class="bc-dropdown-arrow bc-text-brand-sequential-N-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

        </footer>

      </div>

    </section>

    <!-- MODAL SIMPLE DE DETALLE (OPCIONAL) -->
    @if ($isModalOpen() && $selectedProject(); as project)
      <div class="bc-modal-backdrop bc-d-flex bc-align-items-center bc-justify-content-center">
        <div class="bc-modal-content bc-bg-white bc-border-radius-2-full bc-p-4 bc-d-flex bc-flex-column bc-gap-3">
          <div class="bc-d-flex bc-justify-content-between bc-align-items-center">
            <h3 class="bc-m-0 bc-opensans-font-style-4-bold">{{ project.name }}</h3>
            <button type="button" (click)="onCloseDetail()" class="bc-btn-close">&times;</button>
          </div>
          <p class="bc-m-0 bc-opensans-font-style-2-regular bc-text-brand-sequential-N-500">
            {{ project.description ?? 'Sin descripción disponible.' }}
          </p>
          <div class="bc-d-flex bc-justify-content-end bc-pt-2">
            <button type="button" (click)="onCloseDetail()" class="bc-btn-confirm bc-border-radius-1-full bc-p-2 bc-opensans-font-style-2-semibold">
              Cerrar
            </button>
          </div>
        </div>
      </div>
      }


nv-card-container {
      display: block;
      width: 100%;
    }
    .project-card-item {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .project-card-item:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    .bc-score-badge {
      background-color: #e0f2fe;
      color: #0284c7;
      border: 1px solid #bae6fd;
      padding: 3px 12px;
      font-size: 13px;
      line-height: 1.2;
    }
    .bc-icon-clock {
      width: 18px;
      height: 18px;
    }
    .bc-btn-detail {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      font-size: 13px;
    }
    .bc-btn-detail:hover {
      color: #0f172a;
    }
    .bc-pagination-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .bc-pagination-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .bc-pagination-arrow {
      width: 14px;
      height: 14px;
    }
    .bc-pagination-current {
      min-width: 18px;
      text-align: center;
      font-size: 12px;
    }
    .bc-dropdown-arrow {
      width: 14px;
      height: 14px;
    }
    .bc-border-top {
      border-top: 1px solid #e2e8f0;
    }
    /* Estilos del modal auxiliar */
    .bc-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      z-index: 999;
      backdrop-filter: blur(2px);
    }
    .bc-modal-content {
      width: 100%;
      max-width: 440px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .bc-btn-close {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #64748b;
    }
    .bc-btn-confirm {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding-left: 18px;
      padding-right: 18px;
      cursor: pointer;
}
