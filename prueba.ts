const mockAuthors: IDevelopers = {
  count: 1,
  page: 1,
  size: 15,
  results: [
    {
      position: 1,
      nombreCompleto: 'Test User',
      level: 'Senior',
      score: 95.5,
      rol: 'Developer',
    },
  ],
};












describe('getLevelBadgeClass', () => {
  it('should return default class when level is null or undefined', () => {
    expect(spectator.component.getLevelBadgeClass(null)).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
    );
    expect(spectator.component.getLevelBadgeClass(undefined)).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
    );
    expect(spectator.component.getLevelBadgeClass('')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
    );
  });

  it('should return semi-senior class for semi-senior variants', () => {
    expect(spectator.component.getLevelBadgeClass('semi-senior')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.SEMI_SENIOR]
    );
    expect(spectator.component.getLevelBadgeClass('semi.senior')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.SEMI_SENIOR]
    );
    expect(spectator.component.getLevelBadgeClass('ssr')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.SEMI_SENIOR]
    );
  });

  it('should return senior class for senior variants', () => {
    expect(spectator.component.getLevelBadgeClass('Senior')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.SENIOR]
    );
    expect(spectator.component.getLevelBadgeClass('sr')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.SENIOR]
    );
  });

  it('should return junior class for junior variants', () => {
    expect(spectator.component.getLevelBadgeClass('Junior')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.JUNIOR]
    );
    expect(spectator.component.getLevelBadgeClass('jr')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.JUNIOR]
    );
  });

  it('should return default class when level is unknown', () => {
    expect(spectator.component.getLevelBadgeClass('trainee')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
    );
    expect(spectator.component.getLevelBadgeClass('lead')).toBe(
      LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
    );
  });
});
