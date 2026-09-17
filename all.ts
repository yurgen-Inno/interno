describe('onOptionSelected', () => {
    const fixedDate = new Date('2026-09-17T12:00:00.000Z');

    const mockRow: IRowDocument = {
      id: 'repo-test',
      title: 'Repo Test',
      region: 'grupobancolombia-innersource',
      created: fixedDate,
      modified: fixedDate,
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
          rowData: expect.objectContaining({
            organization: 'grupobancolombia-innersource',
            repositoryName: 'repo-test',
          }),
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
          rowData: expect.objectContaining({
            organization: 'grupobancolombia-innersource',
            repositoryName: 'repo-test',
          }),
        })
      );
    });

    it('should handle direct string option and convert to uppercase', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected('opt2', mockRow);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          optionSelected: 'OPT2',
          rowData: expect.objectContaining({
            organization: 'grupobancolombia-innersource',
            repositoryName: 'repo-test',
          }),
        })
      );
    });
  });