import { Component, computed, input, output, signal } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IPaginatorV2ChangeEvent,
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

  public readonly $currentPage = signal<number>(1);
  public readonly $itemsPerPage = signal<number>(10);

  public readonly $totalPages = computed<number>(() => {
    const total = this.$data().length;
    const perPage = this.$itemsPerPage();
    return total > 0 ? Math.ceil(total / perPage) : 1;
  });

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const data = this.$data();
    const startIndex = (this.$currentPage() - 1) * this.$itemsPerPage();
    return data.slice(startIndex, startIndex + this.$itemsPerPage());
  });

  public onPageChange(event: IPaginatorV2ChangeEvent): void {
    if (!event || typeof event.currentPage !== 'number') {
      return;
    }

    const requestedPage = event.currentPage;
    const maxPages = this.$totalPages();

    // Guard clause: evitar que avance más allá del total real de páginas
    if (requestedPage > maxPages) {
      event.noMoreRecords?.();
      return;
    }

    this.$currentPage.set(requestedPage);

    // Si la nueva página activa ya es la última, deshabilitamos el botón siguiente en el paginador
    if (requestedPage === maxPages) {
      event.noMoreRecords?.();
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