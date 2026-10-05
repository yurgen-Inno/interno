import { DestroyRef, ElementRef, inject, signal, Signal } from '@angular/core';

export const ELEMENT_WIDTH_DEFAULTS = {
  FALLBACK_WIDTH: 1200,
  MIN_VALID_WIDTH: 0,
} as const;

/**
 * Retorna un Signal de solo lectura con el ancho en px del elemento host.
 * Gestiona el ciclo de vida del ResizeObserver de forma automática usando DestroyRef.
 */
export function injectElementWidth(
  defaultWidth: number = ELEMENT_WIDTH_DEFAULTS.FALLBACK_WIDTH
): Signal<number> {
  const elementRef = inject(ElementRef);
  const destroyRef = inject(DestroyRef);
  const $width = signal<number>(defaultWidth);

  // Early return si no existe ResizeObserver en el entorno de ejecución
  if (typeof ResizeObserver === 'undefined') {
    return $width.asReadonly();
  }

  const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const primaryEntry = entries[0];
    if (!primaryEntry) {
      return;
    }

    const calculatedWidth = Math.floor(primaryEntry.contentRect.width);
    if (calculatedWidth <= ELEMENT_WIDTH_DEFAULTS.MIN_VALID_WIDTH) {
      return;
    }

    $width.set(calculatedWidth);
  });

  resizeObserver.observe(elementRef.nativeElement);

  // Limpieza automática al destruir el componente
  destroyRef.onDestroy(() => {
    resizeObserver.disconnect();
  });

  return $width.asReadonly();
}


import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectElementWidth } from '../../shared/utils/element-width.util';
import { SUMMARY_CARD_CONSTANTS } from './dashboard-summary-card.constants';

// Ajusta las rutas a tus interfaces reales
import { IDashboardOverview } from '../../models/dashboard.interface';
import { BcCardContentConfig } from '@bancolombia/design-system';

@Component({
  selector: 'app-dashboard-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-summary-card.component.html',
  styleUrls: ['./dashboard-summary-card.component.scss'],
})
export class DashboardSummaryCardComponent {
  // 1. Inyección reactiva y desacoplada del ancho
  public readonly $containerWidth = injectElementWidth(SUMMARY_CARD_CONSTANTS.DEFAULT_WIDTH);

  // 2. Input con alias para no romper la interfaz del padre
  public readonly $headerData = input<IDashboardOverview['header']>(undefined, {
    alias: 'headerData',
  });

  // 3. Computed que reacciona a los cambios de datos y de tamaño
  public readonly $cardConfiguration = computed<BcCardContentConfig>(() => {
    const data = this.$headerData();
    const title = data?.title ?? SUMMARY_CARD_CONSTANTS.FALLBACK_TITLE;
    const subtitle = data?.subtitle ?? '';
    const cutoffDate = data?.cutoffDate ?? '';
    const lastUpdated = data?.lastUpdated ?? SUMMARY_CARD_CONSTANTS.FALLBACK_LAST_UPDATED;
    const descriptionText = `${subtitle}${SUMMARY_CARD_CONSTANTS.TEXT_SEPARATOR}${cutoffDate}`.trim();

    return {
      idCard: SUMMARY_CARD_CONSTANTS.CONFIG.ID,
      isActionable: false,
      widthCardContent: this.$containerWidth(),
      cardPosition: SUMMARY_CARD_CONSTANTS.CONFIG.POSITION,
      cardSize: SUMMARY_CARD_CONSTANTS.CONFIG.SIZE,
      cardType: SUMMARY_CARD_CONSTANTS.CONFIG.TYPE,
      iconFloat: SUMMARY_CARD_CONSTANTS.CONFIG.ICON_BOOK,
      configurationIcon: {
        icon: SUMMARY_CARD_CONSTANTS.CONFIG.ICON_BOOK,
      },
      status: {
        color: SUMMARY_CARD_CONSTANTS.CONFIG.STATUS_COLOR,
        text: lastUpdated,
        type: SUMMARY_CARD_CONSTANTS.CONFIG.STATUS_TYPE,
        customIcon: SUMMARY_CARD_CONSTANTS.CONFIG.ICON_INVESTMENT,
        border: SUMMARY_CARD_CONSTANTS.CONFIG.STATUS_BORDER,
      },
      title: {
        value: title,
        typographyClass: '',
      },
      subtitle: {
        value: subtitle,
        typographyClass: '',
      },
      textDescription: {
        value: descriptionText,
        typographyClass: '',
      },
      additionalInfo: [],
    } as BcCardContentConfig;
  });
}


<div class="summary-card-wrapper">
  <cb-card-content [dataConfiguration]="$cardConfiguration()" />
</div>


<app-dashboard-summary-card [headerData]="$overviewData()?.header" />

