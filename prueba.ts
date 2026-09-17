import { Component, computed, input, output, signal } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
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

  // Control de paginación
  public readonly $currentPage = signal<number>(1);
  public readonly $pageSize = signal<number>(10);

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const data = this.$data();
    const startIndex = (this.$currentPage() - 1) * this.$pageSize();
    return data.slice(startIndex, startIndex + this.$pageSize());
  });

  public onPageChange(event: { page?: number; pageIndex?: number; size?: number; pageSize?: number } | number): void {
    if (typeof event === 'number') {
      this.$currentPage.set(event);
      return;
    }

    const newPage = (event.pageIndex !== undefined ? event.pageIndex + 1 : event.page) ?? 1;
    this.$currentPage.set(newPage);

    const newSize = event.pageSize ?? event.size;
    if (newSize) {
      this.$pageSize.set(newSize);
    }
  }

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption = typeof event === 'string'
      ? event
      : event?.optionSeleted ?? event?.optionSelected ?? event?.id ?? event?.value ?? '';

    const optionPayload: IEventSelectDocument = {
      optionSeleted: rawOption.toUpperCase(),
      rowData: row,
    };

    this.$optionSelect.emit({
      option: optionPayload,
      row,
    });
  }
}


---------


<div class="bc-row">
  @defer (on viewport; prefetch on idle) {
    <bc-table-container
      class="bc-col-12"
      [dataTable]="$data()"
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

      @if ($data().length > $pageSize()) {
        <bc-paginator-v2
          [totalItems]="$data().length"
          [pageSize]="$pageSize()"
          [page]="$currentPage()"
          (pageChange)="onPageChange($event)"
        ></bc-paginator-v2>
      }
    </bc-table-container>
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