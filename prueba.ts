<div class="bc-row">
  @defer (on viewport; prefetch on idle) {
    <bc-table-container
      class="bc-col-12"
      [dataTable]="$paginatedData()"
      [cellOptions]="$cellOptions()"
    >
      <bc-table-header title="Dashboards disponibles">
        <em
          class="bc-icon"
          bc-tooltip
          [bcTooltipPosition]="'left'"
          [bcTooltipText]="'Aquí puedes ver y gestionar los dashboards disponibles en las regiones a las que tienes acceso. Puedes crear o eliminar dashboards según tus permisos.'"
        >
          info-circle
        </em>
      </bc-table-header>

      <bc-table-content>
        <table
          caption="tabla"
          bc-table
          [selection]="false"
          [sort]="true"
          [pairPaginators]="false"
          [dropdownHtml]="true"
        >
          <thead>
            <tr>
              <th scope="row" bc-cell scope="col">Repositorio</th>
              <th scope="row" bc-cell scope="col" [fixed]="true">Nombre visible</th>
              <th scope="row" bc-cell scope="col">Organización</th>
              <th scope="row" bc-cell scope="col">URL</th>
              <th scope="row" bc-cell scope="col">Última sincronización</th>
              <th scope="row" bc-cell scope="col" type="action"></th>
            </tr>
          </thead>

          <tbody>
            @for (row of $paginatedData(); track row.organization + '/' + row.repositoryName) {
              <tr>
                <td bc-cell>
                  <strong>{{ row.repositoryName }}</strong>
                </td>
                <td bc-cell>
                  <span class="cell-truncate" [title]="row.name">{{ row.name }}</span>
                </td>
                <td bc-cell>
                  {{ row.organization }}
                </td>
                <td bc-cell>
                  @if (row.url) {
                    <a [href]="row.url" target="_blank" rel="noopener noreferrer" class="bc-link">
                      Ver repositorio
                    </a>
                  } @else {
                    <span class="bc-text-muted">-</span>
                  }
                </td>
                <td bc-cell>
                  <span class="cell-truncate" [title]="row.lastSyncedAtFormatted">
                    {{ row.lastSyncedAtFormatted }}
                  </span>
                </td>
                <td bc-cell type="action">
                  <bc-table-dropdown
                    [row]="row"
                    [alternativeOptionId]="true"
                    [options]="row.menu || []"
                    (onChange)="onOptionSelected($event, row)"
                  ></bc-table-dropdown>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </bc-table-content>
    </bc-table-container>

    <!-- Paginador colocado como elemento del grid por fuera del contenedor de la tabla -->
    @if ($data().length > $itemsPerPage()) {
      <div class="bc-col-12 bc-mt-3 d-flex justify-content-end">
        <bc-paginator-v2
          id="documentsPaginator"
          type="numeric"
          [totalItems]="$data().length"
          [itemsPerPage]="$itemsPerPage()"
          [initialPage]="$currentPage()"
          (onChangePage)="onPageChange($event)"
        ></bc-paginator-v2>
      </div>
    }
  } @placeholder {
    <div class="bc-col-12 bc-p-4">
      <div style="height: 400px; width: 100%; background: rgba(128, 128, 128, 0.1); border-radius: 3px;"></div>
    </div>
  } @loading (after 100ms; minimum 500ms) {
    <div class="bc-col-12 bc-p-4">
      <div style="height: 400px; width: 100%; background: rgba(128, 128, 128, 0.1); border-radius: 3px; animation: pulse 1.5s infinite;"></div>
    </div>
  }
</div>