import { CardPrimaryConfig } from '@bancolombia/design-system'; // Ajusta la ruta del import
import { ScoreStatus } from '../../models/dashboard.interface';

// Extrae el tipo literal directamente de la interfaz del componente
export type CardPrimaryStatusColor = NonNullable<CardPrimaryConfig['componentStatus']>['color'];

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
    DESCRIPTION: 'Text paragraph with different extension. Here you can use one or more text lines.',
    ICON: 'podcast',
    ARIAL_LABEL: 'arial label icon',
    CARD_SIZE: 'small',
    CARD_POSITION: 'horizontal',
    CARD_TYPE: 'card-icon',
    STATUS_TEXT: 'Status',
    STATUS_COLOR: 'status-success-3',
    STATUS_TYPE: 'only',
    STATUS_ICON: 'icon-investment',
    STATUS_BORDER: 'center',
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
} as const;

export const STATUS_COLOR_MAP: Record<ScoreStatus, CardPrimaryStatusColor> = {
  EXCELLENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.EXCELLENT,
  GOOD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.GOOD,
  REGULAR: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.REGULAR,
  BAD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  CRITICAL: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  IN_DEVELOPMENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT,
};



import { CardPrimaryConfig } from '@bancolombia/design-system';
import {
  CardPrimaryStatusColor,
  DASHBOARD_CARDS_CONSTANTS,
  STATUS_COLOR_MAP,
} from './dashboards-cards.constants';
import { ScoreStatus } from '../../models/dashboard.interface';

// ... dentro de la clase DashboardsCardsComponent:

public readonly $cardsConfigurations = computed<CardPrimaryConfig[]>(() => {
  const items = this.$cards() ?? [];

  return items.map((item, index) => {
    const displayTitle = item.scoreDisplay
      ? `${item.title}${DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.TITLE_SEPARATOR}${item.scoreDisplay}`
      : item.title;

    return {
      id: `kpi-card-${item.id || index}`,
      variant: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.VARIANT,
      typeIcon: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.TYPE_ICON,
      classColorBorder: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.BORDER_COLOR_CLASS,
      borderColor: true,
      infoAccount: {
        title: displayTitle,
        subtitle: item.description,
        titleTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        subtitleTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textOneTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textTwoTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textThreeTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      subInfoAccount: {
        title: displayTitle,
        subtitle: item.description,
        titleTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        subtitleTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textOneTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textTwoTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textThreeTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      dataOne: {
        titleData: item.rangeLabel,
        data: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        textAlign: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.ALIGN_LEFT,
        iconFranchise: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        titleDataTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        dataTypographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      componentStatus: {
        type: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.STATUS_TYPE,
        color: this.mapStatusColor(item.status),
        border: DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.STATUS_BORDER,
        text: item.statusLabel,
      },
    } as CardPrimaryConfig;
  });
});

private mapStatusColor(status: ScoreStatus): CardPrimaryStatusColor {
  return STATUS_COLOR_MAP[status] ?? DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT;
}