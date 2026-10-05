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
    STATUS_TEXT: 'Objetivo',
    STATUS_COLOR: 'status-success-3',
    STATUS_TYPE: 'only',
    STATUS_ICON: 'icon-investment',
    STATUS_BORDER: 'center',
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
} as const;

export const STATUS_COLOR_MAP: Record<ScoreStatus, CardPrimaryStatusColor> = {
  EXCELLENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.EXCELLENT,
  GOOD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.GOOD,
  REGULAR: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.REGULAR,
  BAD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  CRITICAL: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  IN_DEVELOPMENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT,
};


import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { injectElementWidth } from '../../shared/utils/card-width-util/element-width.util';
import { IDashboardOverview, ScoreStatus } from '../../models/dashboard.interface';
import { BcCardContentConfig, CardPrimaryConfig } from '@bancolombia/design-system';
import {
  CardPrimaryStatusColor,
  DASHBOARD_CARDS_CONSTANTS,
  STATUS_COLOR_MAP,
  ThresholdItem,
} from './dashboards-cards.constants';

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboards-cards.component.html',
  styleUrls: ['./dashboards-cards.component.scss'],
})
export class DashboardsCardsComponent {
  public readonly $containerWidth = injectElementWidth();

  public readonly $cards = input<IDashboardOverview['kpiCards'] | undefined>([], {
    alias: 'cards',
  });

  // Recibe los umbrales de la API si están disponibles
  public readonly $thresholds = input<ThresholdItem[] | undefined>(undefined, {
    alias: 'thresholds',
  });

  public readonly $topCardConfiguration = computed<BcCardContentConfig>(() => ({
    idCard: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ID,
    isActionable: false,
    widthCardContent: this.$containerWidth(),
    cardPosition: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_POSITION,
    cardSize: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_SIZE,
    cardType: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_TYPE,
    iconFloat: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ICON,
    configurationPhoto: {
      urlPhoto: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      altPhoto: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
    },
    configurationIllustration: {
      name: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      alt: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
    },
    configurationIcon: {
      icon: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ICON,
      arialLabel: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ARIAL_LABEL,
    },
    title: {
      value: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.TITLE,
      typographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
    },
    subtitle: {
      value: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.SUBTITLE,
      typographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
    },
    textDescription: {
      value: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.DESCRIPTION,
      typographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
    },
  } as BcCardContentConfig));

  // Configuración de la card inferior mapeando los 5 rangos en additionalInfo
  public readonly $bottomCardConfiguration = computed<BcCardContentConfig>(() => {
    const activeThresholds =
      this.$thresholds() && this.$thresholds()!.length > 0
        ? this.$thresholds()!
        : DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.DEFAULT_THRESHOLDS;

    const mappedAdditionalInfo = activeThresholds.map((threshold) => ({
      status: {
        color: this.mapStatusColor(threshold.statusKey),
        text: `${threshold.range} ${threshold.level}`,
        type: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_TYPE,
        border: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_BORDER,
      },
    }));

    return {
      idCard: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ID,
      isActionable: false,
      widthCardContent: this.$containerWidth(),
      cardPosition: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.CARD_POSITION,
      cardSize: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.CARD_SIZE,
      cardType: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.CARD_TYPE,
      iconFloat: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ICON,
      configurationPhoto: {
        urlPhoto: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        altPhoto: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      configurationIllustration: {
        name: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
        alt: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      configurationIcon: {
        icon: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ICON,
        arialLabel: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ARIAL_LABEL,
      },
      title: {
        value: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.TITLE,
        typographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      textDescription: {
        value: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.DESCRIPTION,
        typographyClass: DASHBOARD_CARDS_CONSTANTS.EMPTY_STRING,
      },
      // Insertamos los 5 rangos con sus badges de colores:
      additionalInfo: mappedAdditionalInfo,
    } as BcCardContentConfig;
  });

  public readonly $cardsConfigurations = computed<CardPrimaryConfig[]>(() => {
    const items = this.$cards() ?? [];

    return items.map((item, index) => {
      const displayTitle = item.scoreDisplay
        ? `${item.title}${DASHBOARD_CARDS_CONSTANTS.KPI_CONFIG.TITLE_SEPARATOR}${item.scoreDisplay}`
        : item.title;

      return {
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
}


<app-dashboards-cards 
  [cards]="$overviewData()?.kpiCards ?? []" 
  [thresholds]="$overviewData()?.scoreThresholds" 
/>