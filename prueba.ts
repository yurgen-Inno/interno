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
} from '@core/models/documents.model';

export const PAGINATOR_CONFIG = {
  ID: 'documentsPaginator',
  TYPE: 'basic',
  DEFAULT_ITEMS_PER_PAGE: 10,
  INITIAL_PAGE: 1,
} as const;

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

  readonly $optionSelect = output<IEventSelectDocument>();

  public readonly paginatorId = PAGINATOR_CONFIG.ID;
  public readonly paginatorType = PAGINATOR_CONFIG.TYPE;
  public readonly initialPage = PAGINATOR_CONFIG.INITIAL_PAGE;

  public readonly $currentPage = signal<number>(PAGINATOR_CONFIG.INITIAL_PAGE);
  public readonly $itemsPerPage = signal<number>(PAGINATOR_CONFIG.DEFAULT_ITEMS_PER_PAGE);

  public readonly $totalPages = computed<number>(() => {
    const totalRecords = this.$data().length;
    const perPage = this.$itemsPerPage();
    return totalRecords > 0 ? Math.ceil(totalRecords / perPage) : PAGINATOR_CONFIG.INITIAL_PAGE;
  });

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const startIndex = (this.$currentPage() - 1) * this.$itemsPerPage();
    return this.$data().slice(startIndex, startIndex + this.$itemsPerPage());
  });

  public onPageChange(event: IPaginatorV2ChangeEvent): void {
    if (!event || typeof event.currentPage !== 'number') {
      return;
    }

    const requestedPage = event.currentPage;
    const maxPages = this.$totalPages();

    if (requestedPage > maxPages) {
      event.noMoreRecords?.();
      return;
    }

    this.$currentPage.set(requestedPage);

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
        : event?.optionSelected ?? event?.optionSeleted ?? event?.id ?? event?.value ?? '';

    this.$optionSelect.emit({
      optionSelected: rawOption.toUpperCase(),
      rowData: row,
    });
  }
}