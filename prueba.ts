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

export interface ProcessedThreshold {
  range: string;
  level: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboards-cards.component.html',
  styleUrls: ['./dashboards-cards.component.scss'],
})
export class DashboardsCardsComponent {
  // Ancho autogestionado por el utilitario reactivo
  public readonly $containerWidth = injectElementWidth();

  // Inputs con alias para mantener la compatibilidad con el componente padre
  public readonly $cards = input<IDashboardOverview['kpiCards'] | undefined>([], {
    alias: 'cards',
  });

  public readonly $thresholds = input<ThresholdItem[] | undefined>(undefined, {
    alias: 'thresholds',
  });

  // Configuración de la tarjeta superior
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

  // Configuración de la tarjeta inferior (base de datos y layout)
  public readonly $bottomCardConfiguration = computed<BcCardContentConfig>(() => ({
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
    additionalInfo: [],
  } as BcCardContentConfig));

  // Lista de los 5 estados de umbral con formato y color de badge asignado
  public readonly $thresholdList = computed<ProcessedThreshold[]>(() => {
    const rawThresholds = this.$thresholds();
    const activeThresholds =
      rawThresholds && rawThresholds.length > 0
        ? rawThresholds
        : DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.DEFAULT_THRESHOLDS;

    return activeThresholds.map((item) => ({
      range: item.range,
      level: item.level.toUpperCase(),
      colorClass: this.resolveBadgeClass(item.statusKey),
    }));
  });

  // Configuración del grid de tarjetas intermedias (KPIs)
  public readonly $cardsConfigurations = computed<CardPrimaryConfig[]>(() => {
    const items = this.$cards() ?? [];

    return items.map((item) => {
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

  private resolveBadgeClass(status: ScoreStatus): string {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return DASHBOARD_CARDS_CONSTANTS.BADGE_CLASSES.SUCCESS;
      case 'REGULAR':
        return DASHBOARD_CARDS_CONSTANTS.BADGE_CLASSES.WARNING;
      case 'BAD':
      case 'CRITICAL':
        return DASHBOARD_CARDS_CONSTANTS.BADGE_CLASSES.DANGER;
      default:
        return DASHBOARD_CARDS_CONSTANTS.BADGE_CLASSES.NEUTRAL;
    }
  }
}

<div class="cards-layout">
  <!-- Card Superior -->
  <div class="card-row">
    <cb-card-content [dataConfiguration]="$topCardConfiguration()" />
  </div>

  <!-- Grid de tarjetas de KPIs -->
  <div class="cards-grid">
    @for (cardConfig of $cardsConfigurations(); track $index) {
      <div class="cards-grid__item">
        <cb-card-primary [config]="cardConfig" />
      </div>
    }
  </div>

  <!-- Card Inferior (Valor Objetivo con los 5 estados) -->
  <div class="bottom-card-container">
    <cb-card-content [dataConfiguration]="$bottomCardConfiguration()" />

    <!-- Badges de los 5 rangos de porcentaje -->
    <div class="thresholds-row">
      @for (threshold of $thresholdList(); track threshold.range) {
        <span class="threshold-badge" [ngClass]="threshold.colorClass">
          {{ threshold.range }} {{ threshold.level }}
        </span>
      }
    </div>
  </div>
</div>

:host {
  display: block;
  width: 100%;
}

.cards-layout {
  display: flex;
  flex-direction: column;
  width: 100%;

  .card-row {
    display: flex;
    width: 100%;

    cb-card-content {
      display: block;
      width: 100%;
    }
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 24px;

    &__item {
      position: relative;
      display: flex;
      width: 100%;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        cursor: pointer;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: #59cbe8;
        z-index: 2;
      }

      cb-card-primary {
        width: 100%;
        background: transparent;
        border: none;
      }
    }
  }

  .bottom-card-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    cb-card-content {
      display: block;
      width: 100%;
    }

    .thresholds-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      padding-left: 8px;

      .threshold-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.3px;

        &.badge-success {
          background-color: #e8f5e9;
          color: #1b5e20;
          border: 1px solid #c8e6c9;
        }

        &.badge-warning {
          background-color: #fff9c4;
          color: #827717;
          border: 1px solid #fff59d;
        }

        &.badge-danger {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        &.badge-neutral {
          background-color: #f5f5f5;
          color: #616161;
          border: 1px solid #e0e0e0;
        }
      }
    }
  }
}


<app-dashboards-cards 
  [cards]="$overviewData()?.kpiCards ?? []"
  [thresholds]="$overviewData()?.scoreThresholds" 
/>