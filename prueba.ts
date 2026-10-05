import { ScoreStatus } from '../../models/dashboard.interface'; // Ajusta la ruta a tu modelo

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

export const STATUS_COLOR_MAP: Record<ScoreStatus, string> = {
  EXCELLENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.EXCELLENT,
  GOOD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.GOOD,
  REGULAR: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.REGULAR,
  BAD: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  CRITICAL: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.CRITICAL,
  IN_DEVELOPMENT: DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT,
};




import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectElementWidth } from '../../shared/utils/element-width.util';
import {
  DASHBOARD_CARDS_CONSTANTS,
  STATUS_COLOR_MAP,
} from './dashboards-cards.constants';

// Ajusta las rutas a las interfaces reales de tu proyecto
import { IDashboardOverview, ScoreStatus } from '../../models/dashboard.interface';
import { BcCardContentConfig } from '@bancolombia/design-system';

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboards-cards.component.html',
  styleUrls: ['./dashboards-cards.component.scss'],
})
export class DashboardsCardsComponent {
  // Ancho dinámico autogestionado para todo el contenedor del componente
  public readonly $containerWidth = injectElementWidth();

  // Input de tarjetas con alias para preservar la compatibilidad con el padre
  public readonly $cards = input<IDashboardOverview['kpiCards'] | undefined>([], {
    alias: 'cards',
  });

  // 1. Configuración de la card superior
  public readonly $topCardConfiguration = computed<BcCardContentConfig>(() => ({
    idCard: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ID,
    isActionable: false,
    widthCardContent: this.$containerWidth(),
    cardPosition: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_POSITION,
    cardSize: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_SIZE,
    cardType: DASHBOARD_CARDS_CARDS_CARD_TYPE_RESOLVER(),
    iconFloat: DASHBOARD_CARDS_CONSTANTS.TOP_CARD.ICON,
    configurationPhoto: { urlPhoto: '', altPhoto: '' },
    configurationIllustration: { name: '', alt: '' },
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

  // 2. Configuración de la card inferior (Valor objetivo)
  public readonly $bottomCardConfiguration = computed<BcCardContentConfig>(() => ({
    idCard: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ID,
    isActionable: false,
    widthCardContent: this.$containerWidth(),
    cardPosition: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.CARD_POSITION,
    cardSize: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.CARD_SIZE,
    cardType: DASHBOARD_CARDS_CARDS_CARD_TYPE_RESOLVER(),
    iconFloat: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.ICON,
    configurationPhoto: { urlPhoto: '', altPhoto: '' },
    configurationIllustration: { name: '', alt: '' },
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
    status: {
      color: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_COLOR,
      text: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_TEXT,
      type: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_TYPE,
      customIcon: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_ICON,
      border: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_BORDER,
    },
  } as BcCardContentConfig));

  // 3. Grid de tarjetas intermedias
  public readonly $cardsConfigurations = computed(() => {
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
      };
    });
  });

  // Mapeo sin complejidad ciclomática por diccionario
  private mapStatusColor(status: ScoreStatus): string {
    return STATUS_COLOR_MAP[status] ?? DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT;
  }
}

function DASHBOARD_CARDS_CARDS_CARD_TYPE_RESOLVER(): string {
  return DASHBOARD_CARDS_CONSTANTS.TOP_CARD.CARD_TYPE;
}



<div class="cards-layout">
  <!-- Card Superior -->
  <div class="card-row">
    <cb-card-content [dataConfiguration]="$topCardConfiguration()" />
  </div>

  <!-- Grid de tarjetas de KPIs -->
  <div class="cards-grid">
    @for (cardConfig of $cardsConfigurations(); track cardConfig.id) {
      <div class="cards-grid__item">
        <cb-card-primary [config]="cardConfig" />
      </div>
    }
  </div>

  <!-- Card Inferior (Valor Objetivo) -->
  <div class="card-row">
    <cb-card-content [dataConfiguration]="$bottomCardConfiguration()" />
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
}