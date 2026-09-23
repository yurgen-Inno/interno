export const LEVEL_STATUS = {
  SENIOR: 'senior',
  SEMI_SENIOR: 'semi-senior',
  JUNIOR: 'junior',
  DEFAULT: 'default',
} as const;

export type LevelStatusType = typeof LEVEL_STATUS[keyof typeof LEVEL_STATUS];

export const LEVEL_CLASS_MAP: Record<LevelStatusType, string> = {
  [LEVEL_STATUS.SENIOR]: 'level-badge--senior',
  [LEVEL_STATUS.SEMI_SENIOR]: 'level-badge--semi-senior',
  [LEVEL_STATUS.JUNIOR]: 'level-badge--junior',
  [LEVEL_STATUS.DEFAULT]: 'level-badge--default',
};


import { LEVEL_STATUS, LEVEL_CLASS_MAP } from './list-authors.constants';

// Dentro de tu clase ListAuthorsComponent:
public getLevelBadgeClass(level: string | null | undefined): string {
  if (!level) {
    return LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT];
  }

  const normalized = level.toLowerCase().replace(/[\s._]+/g, '-');

  if (normalized.includes('semi') || normalized === 'ssr') {
    return LEVEL_CLASS_MAP[LEVEL_STATUS.SEMI_SENIOR];
  }
  if (normalized.includes('senior') || normalized === 'sr') {
    return LEVEL_CLASS_MAP[LEVEL_STATUS.SENIOR];
  }
  if (normalized.includes('junior') || normalized === 'jr') {
    return LEVEL_CLASS_MAP[LEVEL_STATUS.JUNIOR];
  }

  return LEVEL_CLASS_MAP[LEVEL_STATUS.DEFAULT];
}


.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;

  .level-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  // Verde para Senior
  &--senior {
    background-color: #e8f5e9;
    color: #1b5e20;
    .level-dot {
      background-color: #2e7d32;
    }
  }

  // Azul para Semi-Senior
  &--semi-senior {
    background-color: #e3f2fd;
    color: #0d47a1;
    .level-dot {
      background-color: #1976d2;
    }
  }

  // Ámbar/Naranja para Junior
  &--junior {
    background-color: #fff8e1;
    color: #b78103;
    .level-dot {
      background-color: #f57f17;
    }
  }

  // Gris por defecto
  &--default {
    background-color: #f5f5f5;
    color: #616161;
    .level-dot {
      background-color: #9e9e9e;
    }
  }
}

<td bc-cell>
  <span class="level-badge" [ngClass]="getLevelBadgeClass(row.level)">
    <span class="level-dot"></span>
    {{ row.level }}
  </span>
</td>