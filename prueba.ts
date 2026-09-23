@if (resourceGetAllTabs.isLoading()) {
  <ng-container [ngTemplateOutlet]="tableSkeleton" />
} @else if (!resourceGetAllTabs.value()?.count) {
  <section class="bc-mt-4 bc-row">
    <div class="bc-col-12">
      <app-error-state
        [type]="'info'"
        [title]="'Sin resultados'"
        [message]="'No encontramos códigos para mostrar.'"
        ($retry)="resourceGetAllTabs.reload()" />
    </div>
  </section>
} @else {
  <section class="bc-mt-4 bc-row">
    @defer (on viewport; prefetch on idle) {
      <div class="bc-col-12">
        
        <!-- Cabecera limpia sin tabla -->
        <div class="ranking-header">
          <h2 class="title">Ranking</h2>
          <p class="subtitle">Compara tu posición con otros miembros del equipo</p>
        </div>

        <!-- Lista de tarjetas dinámica -->
        <div class="card-list">
          @for (row of $data(); track row.applicationCode || $index) {
            <div class="card-item">
              <!-- Información principal (Título y Subtítulo) -->
              <div class="card-info">
                <span class="card-title">{{ row.applicationCode }}</span>
                <span class="card-subtitle">{{ row.filial }}</span>
              </div>

              <!-- Badges y botón de acción -->
              <div class="card-actions">
                <!-- Badge de nivel/seniority -->
                <span class="badge" [attr.data-tag]="getLevelTone(row.levelProject)">
                  {{ row.levelProject }}
                </span>

                <!-- Botón de detalle que ya tenías -->
                <nv-button
                  typeButton="ghost"
                  sizeButton="small"
                  [routerLink]="['/seniority/detail']">
                  <nv-icon fontIcon="icon-view"></nv-icon>
                  Ver detalle
                </nv-button>
              </div>
            </div>
          }
        </div>

      </div>
    } @placeholder {
      <span>Se están consultando los datos disponibles</span>
    }

    <!-- Paginador original -->
    @if (resourceGetAllTabs.value()) {
      <div class="bc-col-12 bc-mt-4" id="paginator-numeric-element">
        <bc-paginator-v2
          [prevText]="'Anterior'"
          [nextText]="'Siguiente'"
          [type]="'numeric'"
          [id]="'paginator-numeric-sync'"
          [totalItems]="resourceGetAllTabs.value().count"
          [initialPage]="resourceGetAllTabs.value().page"
          [itemsPerPage]="15"
          [showPageSize]="false"
          [showInfoItems]="true"
          (onChangePage)="onChangePage($event)">
        </bc-paginator-v2>
      </div>
    }
  </section>
}

<!-- Template del Skeleton -->
<ng-template #tableSkeleton>
  ... (mantén aquí tu skeleton original tal como está)
</ng-template>


.ranking-header {
  margin-bottom: 1rem;
  padding: 0 0.25rem;

  .title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
}

.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: box-shadow 0.15s ease, background-color 0.15s ease;

  &:hover {
    background-color: #f9fafb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    .card-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
    }

    .card-subtitle {
      font-size: 0.8125rem;
      color: #6b7280;
    }
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}