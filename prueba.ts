readonly $optionSelect = output<IEventSelectDocument>();

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event?.optionSelected ?? event?.optionSeleted ?? event?.id ?? event?.value ?? '';

    const normalizedAction = rawOption.trim().toUpperCase();

    this.$optionSelect.emit({
      optionSelected: normalizedAction,
      rowData: row,
    });
  }


  public onTableOptionSelect(event: IEventSelectDocument): void {
    const rawOption = event?.optionSelected ?? event?.optionSeleted ?? '';
    const selectedOption = rawOption.trim().toUpperCase();
    const row = event?.rowData;

    if (!row || !selectedOption) {
      return;
    }

    if (selectedOption === EEventSelectItem.OPT2 || selectedOption === 'OPT2') {
      this.promptDeleteModal(row);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT1 || selectedOption === 'OPT1') {
      this.navigateWithMode(row, EResourceViewMode.VIEW);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT3 || selectedOption === 'OPT3') {
      this.navigateWithMode(row, EResourceViewMode.EDIT);
      return;
    }
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



  