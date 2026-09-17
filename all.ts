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

      expect(spy).toHaveBeenCalledTimes(1);
      const emittedPayload = spy.mock.calls[0][0] as Record<string, unknown>;
      expect(emittedPayload['optionSelected']).toBe('OPT3');
      expect(emittedPayload['rowData']).toEqual(mockRow);
    });

    it('should handle optionSelected without typo and emit standard payload', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected(
        { optionSelected: 'opt1' },
        mockRow
      );

      expect(spy).toHaveBeenCalledTimes(1);
      const emittedPayload = spy.mock.calls[0][0] as Record<string, unknown>;
      expect(emittedPayload['optionSelected']).toBe('OPT1');
      expect(emittedPayload['rowData']).toEqual(mockRow);
    });

    it('should handle direct string option and convert to uppercase', () => {
      const spy = jest.spyOn(spectator.component.$optionSelect, 'emit');

      spectator.component.onOptionSelected('opt2', mockRow);

      expect(spy).toHaveBeenCalledTimes(1);
      const emittedPayload = spy.mock.calls[0][0] as Record<string, unknown>;
      expect(emittedPayload['optionSelected']).toBe('OPT2');
      expect(emittedPayload['rowData']).toEqual(mockRow);
    });
  });