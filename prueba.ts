import { Component, computed, input } from '@angular/core';
import { CbCardPrimary } from '@your-design-system/core';
import { IDashboardOverview, ScoreStatus } from '../../../../core/models/tech-dashboards.model';

@Component({
  selector: 'app-dashboards-cards',
  standalone: true,
  imports: [CbCardPrimary],
  templateUrl: './dashboards-cards.component.html',
  styleUrl: './dashboards-cards.component.scss',
})
export class DashboardsCardsComponent {
  public cards = input<IDashboardOverview['kpiCards'] | undefined>([]);

  private mapStatusColor(status: ScoreStatus): string {
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

  public cardsConfigurations = computed(() => {
    const list = this.cards() ?? [];

    return list.map((item, index) => {
      const displayTitle = item.scoreDisplay 
        ? `${item.title} · ${item.scoreDisplay}` 
        : item.title;

      return {
        id: `kpi-card-${item.id || index}`,
        variant: 'new-product',
        typeIcon: 'icon',
        icon: 'icon-circle',
        classColorBorder: 'status-info-1',
        borderColor: true,
        infoAccount: {
          title: displayTitle,
          subtitle: item.description,
          titleTypographyClass: '',
          subtitleTypographyClass: '',
          textOneTypographyClass: '',
          textTwoTypographyClass: '',
          textThreeTypographyClass: '',
        },
        dataOne: {
          titleData: item.rangeLabel,
          data: '',
          textAlign: 'left',
          iconFranchise: '',
          titleDataTypographyClass: '',
          dataTypographyClass: '',
        },
        componentStatus: {
          type: 'only',
          color: this.mapStatusColor(item.status),
          border: 'center',
          text: item.statusLabel,
        },
      };
    });
  });
}









<div class="cards-grid">
  @for (cardConfig of cardsConfigurations(); track cardConfig.id) {
    <div class="cards-grid__item">
      <cb-card-primary [config]="cardConfig" />
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

    cb-card-primary {
      width: 100%;
    }
  }
}