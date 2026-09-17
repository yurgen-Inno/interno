export enum EResourceViewMode {
  VIEW = 'view',
  EDIT = 'edit',
}

export enum EPaginatorType {
  BASIC = 'basic',
  NUMERIC = 'numeric',
}

export const PAGINATOR_CONFIG = {
  ID: 'documentsPaginator',
  DEFAULT_ITEMS_PER_PAGE: 10,
  INITIAL_PAGE: 1,
} as const;



import { FormControl } from '@angular/forms';

export interface IResourceForm {
  organization: FormControl<string>;
  repositoryName: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}

export interface IApiHttpError {
  error?: {
    message?: string;
  };
}

export interface IDropdownOptionEvent {
  optionSeleted?: string;
  optionSelected?: string;
  id?: string;
  value?: string;
}

export interface IRowDocument {
  repositoryName: string;
  name: string;
  organization: string;
  url?: string;
  lastSyncedAtFormatted?: string;
  menu?: unknown[];
}

export interface IEventSelectDocument {
  optionSeleted: string;
  rowData: IRowDocument;
}

export interface ITableDocuments {
  option: IEventSelectDocument;
  row: IRowDocument;
}

export interface IPaginatorV2ChangeEvent {
  id: string;
  currentPage: number;
  itemsPerPage: number;
  nextPage: boolean;
  previousPage: boolean;
  noMoreRecords?: () => void;
}







import { Component, computed, input, output, signal } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  EPaginatorType,
  PAGINATOR_CONFIG,
} from '@core/constants/documents.constant';
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

  public readonly paginatorId = PAGINATOR_CONFIG.ID;
  public readonly paginatorType = EPaginatorType.BASIC;
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