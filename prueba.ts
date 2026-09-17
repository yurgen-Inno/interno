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
  readonly $cellOptions = input.required<BcTableOptionMenu[] | Record<string, unknown>>();

  readonly $optionSelect = output<IEventSelectDocument>();

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
        : event?.optionSelected ?? event?.optionSeleted ?? event?.id ?? event?.value ?? '';

    this.$optionSelect.emit({
      optionSelected: rawOption.toUpperCase(),
      rowData: row,
    });
  }
}




import { FormControl } from '@angular/forms';

export interface IDocumentationResource {
  organization: string;
  repositoryName: string;
  name: string;
  description?: string;
  url?: string;
  lastSyncedAt?: string;
}

export interface IRowDocument extends IDocumentationResource {
  id?: string;
  title?: string;
  region?: string;
  created?: Date;
  modified?: Date;
  lastSyncedAtFormatted?: string;
  menu?: unknown[];
}

export interface IEventSelectDocument {
  optionSelected: string;
  optionSeleted?: string;
  rowData: IRowDocument;
}

export interface IPaginatorV2ChangeEvent {
  id: string;
  currentPage: number;
  itemsPerPage: number;
  nextPage: boolean;
  previousPage: boolean;
  noMoreRecords?: () => void;
}

export interface IResourceForm {
  organization: FormControl<string>;
  repositoryName: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}



import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { PAGINATOR_CONFIG } from '@core/constants/documents.constant';
import { IPaginatorV2ChangeEvent, IRowDocument } from '@core/models/documents.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ListAllDocumentsComponent } from './list-all-documents.component';

describe('ListAllDocumentsComponent', () => {
  let spectator: Spectator<ListAllDocumentsComponent>;

  const createComponent = createComponentFactory({
    component: ListAllDocumentsComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        $data: [],$cellOptions: [] as BcTableOptionMenu[],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('onOptionSelected', () => {
    const mockRow: IRowDocument = {
      id: 'repo-test',
      title: 'Repo Test',
      region: 'grupobancolombia-innersource',
      created: new Date(),
      modified: new Date(),
      organization: 'grupobancolombia-innersource',
      repositoryName: 'repo-test',
      name: 'Repo Test',
    };

    it('should normalize optionSeleted typo and emit standard payload', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected(
        { optionSeleted: 'opt3' },
        mockRow
      );

      expect(spy).toHaveBeenCalledWith({
        optionSelected: 'OPT3',
        rowData: mockRow,
      });
    });

    it('should handle optionSelected without typo and emit standard payload', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected(
        { optionSelected: 'opt1' },
        mockRow
      );

      expect(spy).toHaveBeenCalledWith({
        optionSelected: 'OPT1',
        rowData: mockRow,
      });
    });

    it('should handle direct string option and convert to uppercase', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected('opt2', mockRow);

      expect(spy).toHaveBeenCalledWith({
        optionSelected: 'OPT2',
        rowData: mockRow,
      });
    });
  });

  describe('pagination logic', () => {
    const mockRows: IRowDocument[] = Array.from({ length: 12 }, (_, i) => ({
      organization: 'grupobancolombia-innersource',
      repositoryName: `repo-${i + 1}`,
      name: `Doc ${i + 1}`,
    }));

    beforeEach(() => {
      spectator.setInput('$data', mockRows);
      spectator.detectChanges();
    });

    it('should calculate $totalPages correctly', () => {
      expect(spectator.component.$totalPages()).toBe(2);
    });

    it('should return the first page items in $paginatedData', () => {
      const paginated = spectator.component.$paginatedData();
      expect(paginated.length).toBe(10);
      expect(paginated[0].repositoryName).toBe('repo-1');
    });

    it('should update $currentPage and slice the remaining items on page change', () => {
      const noMoreRecordsSpy = jest.fn();
      const event: IPaginatorV2ChangeEvent = {
        id: PAGINATOR_CONFIG.ID,
        currentPage: 2,
        itemsPerPage: 10,
        nextPage: true,
        previousPage: false,
        noMoreRecords: noMoreRecordsSpy,
      };

      spectator.component.onPageChange(event);

      expect(spectator.component.$currentPage()).toBe(2);
      expect(spectator.component.$paginatedData().length).toBe(2);
      expect(noMoreRecordsSpy).toHaveBeenCalledTimes(1);
    });

    it('should not allow navigating past $totalPages', () => {
      const noMoreRecordsSpy = jest.fn();
      const event: IPaginatorV2ChangeEvent = {
        id: PAGINATOR_CONFIG.ID,
        currentPage: 3,
        itemsPerPage: 10,
        nextPage: true,
        previousPage: false,
        noMoreRecords: noMoreRecordsSpy,
      };

      spectator.component.onPageChange(event);

      expect(spectator.component.$currentPage()).toBe(1);
      expect(noMoreRecordsSpy).toHaveBeenCalledTimes(1);
    });
  });
});




// Reemplazar 'view' y 'edit' por el Enum:
import { EResourceViewMode } from '@core/constants/documents.constant';

// En el test de view:
mode: EResourceViewMode.VIEW,

// En el test de edit:
mode: EResourceViewMode.EDIT,




import { EResourceViewMode } from '@core/constants/documents.constant';

setupComponent({
  org: 'grupobancolombia-innersource',
  repo: 'NU5740001_Metrics_Doc',
  mode: EResourceViewMode.EDIT,
});