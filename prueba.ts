import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Ajusta las rutas según la estructura de tu proyecto
import { injectElementWidth } from '../../shared/utils/card-width-util/element-width.util';
import { IDashboardOverview, ScoreStatus } from '../../models/dashboard.interface';
import { BcCardContentConfig, CardPrimaryConfig } from '@bancolombia/design-system';
import {
  CardPrimaryStatusColor,
  DASHBOARD_CARDS_CONSTANTS,
  STATUS_COLOR_MAP,
} from './dashboards-cards.constants';

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboards-cards.component.html',
  styleUrls: ['./dashboards-cards.component.scss'],
})
export class DashboardsCardsComponent {
  // Ancho dinámico del contenedor calculado mediante el utilitario reactivo
  public readonly $containerWidth = injectElementWidth();

  // Input de tarjetas KPI con alias para mantener compatibilidad con el template padre
  public readonly $cards = input<IDashboardOverview['kpiCards'] | undefined>([], {
    alias: 'cards',
  });

  // Configuración de la card superior
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

  // Configuración de la card inferior (Valor Objetivo)
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
    status: {
      color: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_COLOR,
      text: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_TEXT,
      type: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_TYPE,
      customIcon: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_ICON,
      border: DASHBOARD_CARDS_CONSTANTS.BOTTOM_CARD.STATUS_BORDER,
    },
  } as BcCardContentConfig));

  // Configuración reactiva del arreglo de tarjetas KPI centrales
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

  // Mapeo sin complejidad ciclomática tipado estrictamente contra la interfaz de la librería
  private mapStatusColor(status: ScoreStatus): CardPrimaryStatusColor {
    return STATUS_COLOR_MAP[status] ?? DASHBOARD_CARDS_CONSTANTS.STATUS_COLORS.DEFAULT;
  }
}