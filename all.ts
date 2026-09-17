import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { IPaginatorV2ChangeEvent, IRowDocument } from '@core/models/documents.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ListAllDocumentsComponent, PAGINATOR_CONFIG } from './list-all-documents.component';

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

    it('should return first page items in $paginatedData', () => {
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