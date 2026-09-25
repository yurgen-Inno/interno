describe('showAll and toggleShowAll', () => {
    it('should have showAll initialized to false', () => {
      expect(spectator.component.showAll()).toBe(false);
    });

    it('should toggle showAll state when toggleShowAll is called', () => {
      spectator.component.toggleShowAll();
      expect(spectator.component.showAll()).toBe(true);

      spectator.component.toggleShowAll();
      expect(spectator.component.showAll()).toBe(false);
    });
  });

  describe('topContributors and extraContributors', () => {
    it('should split contributors into topContributors and extraContributors correctly', fakeAsync(() => {
      const multipleContributors: ITopContributors[] = Array.from({ length: 8 }, (_, i) => ({
        email: `dev${i + 1}@bank.com`,
        fullName: `Dev ${i + 1}`,
        totalCommits: 10 + i,
      })) as ITopContributors[];

      getTopContributors.mockReturnValue(of(multipleContributors));

      const local = createComponent();
      local.detectChanges();
      tick();
      local.detectChanges();

      expect(local.component.topContributors()).toEqual(multipleContributors.slice(0, 5));

      expect(local.component.extraContributors()).toEqual(multipleContributors.slice(5));
    }));

    it('should have empty extraContributors when total contributors are less than or equal to TOP_CONTRIBUTORS', fakeAsync(() => {
      spectator.detectChanges();
      tick();
      spectator.detectChanges();

      expect(spectator.component.topContributors()).toEqual(mockContributors);
      expect(spectator.component.extraContributors()).toEqual([]);
    }));
  });