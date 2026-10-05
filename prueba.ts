import { CardPrimaryConfig } from '@bancolombia/design-system';
import { ScoreStatus } from '../../models/dashboard.interface';

export type CardPrimaryStatusColor = NonNullable<CardPrimaryConfig['componentStatus']>['color'];

export interface ThresholdItem {
  range: string;
  level: string;
  statusKey: ScoreStatus;
}

export const DASHBOARD_CARDS_CONSTANTS = {
  EMPTY_STRING: '',
  STATUS_COLORS: {
    EXCELLENT: 'status-success-3',
    GOOD: 'status-info-3',
    REGULAR: 'status-alert-3',
    CRITICAL: 'status-error-3',
    DEFAULT: 'status-neutral-3',
  },
  TOP_CARD: {
    ID: 'top-summary-card',
    TITLE: 'Card Content Works!',
    SUBTITLE: 'Subtitle text',
    DESCRIPTION: 'Text paragraph with different extension. Here you can use one or more text lines.',
    ICON: 'icon-book-2',
    ARIAL_LABEL: 'arial label icon',
    CARD_SIZE: 'small',
    CARD_POSITION: 'horizontal',
    CARD_TYPE: 'card-icon',
  },
  BOTTOM_CARD: {
    ID: 'bottom-target-card',
    TITLE: 'Valor objetivo',
    DESCRIPTION: 'Rangos porcentuales de cumplimiento establecidos según el objetivo anual.',
    ICON: 'podcast',
    ARIAL_LABEL: 'arial label icon',
    CARD_SIZE: 'small',
    CARD_POSITION: 'horizontal',
    CARD_TYPE: 'card-icon',
    DEFAULT_THRESHOLDS: [
      { range: '0% - 30%', level: 'Crítico', statusKey: 'CRITICAL' },
      { range: '31% - 50%', level: 'Malo', statusKey: 'BAD' },
      { range: '51% - 70%', level: 'Regular', statusKey: 'REGULAR' },
      { range: '71% - 85%', level: 'Bueno', statusKey: 'GOOD' },
      { range: '86% - 100%', level: 'Excelente', statusKey: 'EXCELLENT' },
    ] as ThresholdItem[],
  },
  KPI_CONFIG: {
    VARIANT: 'new-product',
    TYPE_ICON: 'icon',
    BORDER_COLOR_CLASS: 'status-info-1',
    ALIGN_LEFT: 'left',
    STATUS_TYPE: 'only',
    STATUS_BORDER: 'center',
    TITLE_SEPARATOR: ' • ',
  },
  BADGE_CLASSES: {
    SUCCESS: 'badge-success',
    WARNING: 'badge-warning',
    DANGER: 'badge-danger',
    NEUTRAL: 'badge-neutral',
  },
} as const;

export const STATUS_COLOR_MAP: Record<ScoreStatus, CardPrimaryStatusColor> = {
  EXCELLENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.EXCELLENT,
  GOOD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.GOOD,
  REGULAR: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.REGULAR,
  BAD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  CRITICAL: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  IN_DEVELOPMENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT,
};