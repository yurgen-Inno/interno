import { Component, computed, input } from '@angular/core';
import { CbCardContent, BcCardContentConfig } from '@your-design-system/core';
import { IDashboardOverview, ScoreStatus } from '../../../../core/models/tech-dashboards.model';

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CbCardContent],
  templateUrl: './dashboards-cards.component.html',
  styleUrl: './dashboards-cards.component.scss',
})
export class DashboardsCardsComponent {
  public cards = input<IDashboardOverview['kpiCards']>([]);

  private mapStatusColor(status: ScoreStatus): BcCardContentConfig['status']['color'] {
    switch (status) {
      case 'EXCELLENT':
        return 'status-success-3';
      case 'GOOD':
        return 'status-info-3';
      case 'REGULAR':
        return 'status-alert-3';
      case 'BAD':
      case 'CRITICAL':
        return 'status-error-3';
      case 'IN_DEVELOPMENT':
      default:
        return 'status-neutral-3';
    }
  }

  public cardsConfigurations = computed<BcCardContentConfig[]>(() => {
    const list = this.cards() ?? [];

    return list.map((item, index) => {
      const displayTitle = item.scoreDisplay 
        ? `${item.title} · ${item.scoreDisplay}` 
        : item.title;

      return {
        idCard: `kpi-card-${item.id || index}`,
        isActionable: true,
        widthCardContent: 360,
        cardPosition: 'horizontal',
        cardSize: 'small',
        cardType: 'card-icon',
        iconFloat: 'icon-chevron-right',
        configurationIcon: {
          icon: 'icon-circle',
          ariaLabel: item.title,
        },
        status: {
          color: this.mapStatusColor(item.status),
          text: item.statusLabel,
          type: 'only',
          customIcon: '',
          border: 'center',
        },
        title: {
          value: displayTitle,
          typographyClass: '',
        },
        subtitle: {
          value: item.description,
          typographyClass: '',
        },
        textDescription: {
          value: item.rangeLabel,
          typographyClass: '',
        },
        additionalInfo: [],
      } as BcCardContentConfig;
    });
  });
}





<div class="cards-grid">
  @for (cardConfig of cardsConfigurations(); track cardConfig.idCard) {
    <div class="cards-grid__item">
      <cb-card-content [dataConfiguration]="cardConfig" />
    </div>
  }
</div>





.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 24px;

  &__item {
    display: flex;
    width: 100%;

    cb-card-content {
      width: 100%;
    }
  }
}