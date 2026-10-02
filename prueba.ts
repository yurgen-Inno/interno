import { Component, ChangeDetectionStrategy, inject, input, computed, LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { CbCardPrimary, CardPrimaryConfig } from '@core/components';
import { MarketplaceIssuesService } from '../../services/marketplace-issues.service';
import { AdapterMarketplaceIssuesService } from '../../services/adapter-marketplace-issues.service';
import { IContent } from '../../models/marketplace-issues.model';
import { FindTextInAPatternPipe } from '../../pipes/find-text-in-a-pattern.pipe';
import { FindTextColorPipe } from '../../pipes/find-text-color.pipe';

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule, CbCardPrimary],
  providers: [FindTextInAPatternPipe, FindTextColorPipe],
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMarketplaceComponent {
  private readonly _locale = inject(LOCALE_ID);
  private readonly _issuesService = inject(MarketplaceIssuesService);
  private readonly _patternPipe = inject(FindTextInAPatternPipe);
  private readonly _colorPipe = inject(FindTextColorPipe);

  public readonly $content = input.required<IContent>();

  public readonly $reward = computed(() =>
    AdapterMarketplaceIssuesService.toViewModel(
      this.$content()?.labels,
      this._issuesService.$rewardsMap()
    )
  );

  public readonly $cardConfig = computed<CardPrimaryConfig>(() => {
    const content = this.$content();
    const reward = this.$reward();
    const difficult = this._patternPipe.transform(content.labels, 'd:');
    const colorDifficult = this._colorPipe.transform(difficult);

    const formattedDate = content.createdAt
      ? formatDate(content.createdAt, 'dd/MM/yyyy hh:mm a', this._locale)
      : '';

    const rewardText = reward.isVoluntary
      ? `${reward.label} (contribución voluntaria)`
      : reward.label;

    const iconString = reward.nvIcon ?? (reward.faIcon ? `icon-${reward.faIcon.iconName}` : '');

    return {
      variant: 'card-product',
      typeIcon: 'icon',
      icon: iconString,
      classColorBorder: 'status-info-1',
      borderColor: true,
      infoAccount: {
        title: content.title,
        subtitle: `Proyecto: ${content.projectName ?? 'N/A'}`,
        titleTypographyClass: 'bc-opensans-font-style-2-bold bc-text-brand-primary-00',
        subtitleTypographyClass: 'bc-opensans-font-style-2-semibold',
        textOneTypographyClass: 'bc-opensans-font-style-2-semibold',
        textTwoTypographyClass: 'bc-opensans-font-style-2-semibold',
        textThreeTypographyClass: 'bc-opensans-font-style-2-semibold bc-text-brand-primary-00',
        textOne: `Creado: ${formattedDate}`,
        textTwo: `Estado: ${content.state}`,
        textThree: `Recompensa: ${rewardText}`,
      },
      componentStatus: {
        type: 'only',
        color: colorDifficult || 'status-info-3',
        border: 'center',
        text: difficult || 'Sin dificultad',
      },
      componentTagOne: {
        componentId: 'btn-tomar-issue',
        textElement: 'Tomar',
        typeTag: 'button',
        widthBehavior: 'hug',
      },
    };
  });

  public onTagClick(): void {
    const url = this.$content()?.htmlUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}