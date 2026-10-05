export const SUMMARY_CARD_CONSTANTS = {
  DEFAULT_WIDTH: 1200,
  FALLBACK_TITLE: 'Tech Mindfulness Organizacional',
  FALLBACK_LAST_UPDATED: 'Actualizado',
  TEXT_SEPARATOR: ' Corte al ',
  CONFIG: {
    ID: 'summary-main-card',
    POSITION: 'horizontal',
    SIZE: 'small',
    TYPE: 'card-icon',
    ICON_BOOK: 'icon-book-2',
    ICON_INVESTMENT: 'icon-investment',
    STATUS_COLOR: 'status-neutral-3',
    STATUS_TYPE: 'icon-left',
    STATUS_BORDER: 'right',
  },
} as const;



import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SUMMARY_CARD_CONSTANTS } from './dashboard-summary-card.constants';

// Ajusta el import a la ruta real de tus modelos
import { IDashboardOverview } from '../../models/dashboard.interface';
import { BcCardContentConfig } from '@bancolombia/design-system'; 

@Component({
  selector: 'app-dashboard-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-summary-card.component.html',
  styleUrls: ['./dashboard-summary-card.component.scss'],
})
export class DashboardSummaryCardComponent implements OnInit, OnDestroy {
  private readonly _elementRef = inject(ElementRef);
  private _resizeObserver?: ResizeObserver;

  // Signals con prefijo $public readonly$headerData = input<IDashboardOverview['header']>();
  public readonly $containerWidth = signal<number>(SUMMARY_CARD_CONSTANTS.DEFAULT_WIDTH);

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

  public ngOnInit(): void {
    this.setupResizeObserver();
  }

  public ngOnDestroy(): void {
    this._resizeObserver?.disconnect();
  }

  private setupResizeObserver(): void {
    // Early return: Nivel 1 de if
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this._resizeObserver = new ResizeObserver((entries) => {
      this.handleResize(entries);
    });

    this._resizeObserver.observe(this._elementRef.nativeElement);
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    const primaryEntry = entries[0];
    
    // Early return: Nivel 1 de if
    if (!primaryEntry) {
      return;
    }

    const calculatedWidth = Math.floor(primaryEntry.contentRect.width);

    // Early return: Nivel 1 de if
    if (calculatedWidth <= 0) {
      return;
    }

    this.$containerWidth.set(calculatedWidth);
  }
}


<div class="summary-card-wrapper">
  <cb-card-content [dataConfiguration]="$cardConfiguration()" />
</div>
