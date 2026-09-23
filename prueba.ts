describe('getLevelBadgeClass', () => {
    it('should return default class when projectLevel is null, undefined or empty', () => {
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

    it('should return default class when projectLevel is unknown', () => {
      expect(spectator.component.getLevelBadgeClass('Architect')).toBe(
        LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
      );
      expect(spectator.component.getLevelBadgeClass('Lead')).toBe(
        LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT]
      );
    });
  });





  