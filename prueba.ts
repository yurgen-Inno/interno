export interface IEventSelectDocument {
  optionSeleted?: string;
  optionSelected?: string;
  rowData: IRowDocument;
}

export interface ITableDocuments {
  option: IEventSelectDocument;
  row: IRowDocument;
  optionSelected?: string;
  rowData?: IRowDocument;
}




readonly $optionSelect = output<ITableDocuments>();

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event?.optionSelected ?? event?.optionSeleted ?? event?.id ?? event?.value ?? '';

    const normalizedAction = rawOption.trim().toUpperCase();

    const eventPayload: IEventSelectDocument = {
      optionSeleted: normalizedAction,
      optionSelected: normalizedAction,
      rowData: row,
    };

    this.$optionSelect.emit({
      option: eventPayload,
      row,
      optionSelected: normalizedAction,
      rowData: row,
    });
  }



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

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          optionSelected: 'OPT3',
          rowData: mockRow,
        })
      );
    });

    it('should handle optionSelected without typo and emit standard payload', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected(
        { optionSelected: 'opt1' },
        mockRow
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          optionSelected: 'OPT1',
          rowData: mockRow,
        })
      );
    });

    it('should handle direct string option and convert to uppercase', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected('opt2', mockRow);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          optionSelected: 'OPT2',
          rowData: mockRow,
        })
      );
    });
  });

  