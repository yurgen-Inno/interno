import { Component, computed, ElementRef, input, output, signal, viewChild, afterNextRender } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IPaginatorDetailEvent,
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

  private readonly paginatorRef = viewChild<ElementRef<HTMLElement>>('paginatorElement');

  public readonly $currentPage = signal<number>(1);
  public readonly $itemsPerPage = signal<number>(2);

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const data = this.$data();
    const startIndex = (this.$currentPage() - 1) * this.$itemsPerPage();
    return data.slice(startIndex, startIndex + this.$itemsPerPage());
  });

  constructor() {
    afterNextRender(() => {
      const container = this.paginatorRef()?.nativeElement;
      if (!container) {
        return;
      }

      container.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement | null;
        if (!link) {
          return;
        }

        event.preventDefault();
        this.handlePaginatorLinkClick(link);
      });
    });
  }

  private handlePaginatorLinkClick(link: HTMLAnchorElement): void {
    const href = link.getAttribute('href') ?? '';
    const text = link.textContent?.trim() ?? '';
    const totalPages = Math.ceil(this.$data().length / this.$itemsPerPage());

    if (href.includes('next') || link.className.includes('next')) {
      if (this.$currentPage() < totalPages) {
        this.$currentPage.update((page) => page + 1);
      }
      return;
    }

    if (href.includes('prev') || link.className.includes('prev')) {
      if (this.$currentPage() > 1) {
        this.$currentPage.update((page) => page - 1);
      }
      return;
    }

    const numericPage = Number.parseInt(text, 10);
    if (!Number.isNaN(numericPage)) {
      this.$currentPage.set(numericPage);
    }
  }

  public onPaginatorEvent(event: unknown): void {
    const customEvent = event as IPaginatorDetailEvent;
    if (typeof customEvent?.detail === 'number') {
      this.$currentPage.set(customEvent.detail);
      return;
    }

    if (typeof customEvent?.detail === 'object' && customEvent.detail !== null) {
      const page = customEvent.detail.page ?? customEvent.detail.pageActive;
      if (page) {
        this.$currentPage.set(page);
      }
    }
  }

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
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

      @if ($data().length > $itemsPerPage()) {
        <bc-paginator-v2
          #paginatorElement
          [totalItems]="$data().length"
          [itemsPerPage]="$itemsPerPage()"
          (paginator)="onPaginatorEvent($event)"
          (pageSelected)="onPaginatorEvent($event)"
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