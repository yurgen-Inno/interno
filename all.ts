import { IRowDocument } from '@core/models/documents.model';
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
        $data: [],
        $cellOptions: {} as any,
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
});