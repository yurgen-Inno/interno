import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAws, faGithub, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faU } from '@fortawesome/free-solid-svg-icons';

export const REWARD_CONFIG = {
  PREFIX: 'rw:',
  DELIMITER: '-',
  JOIN_SEPARATOR: ' ',
  DEFAULT_ICON: 'icon-gift',
  VOLUNTARY_ICON: 'icon-hand-handshake',
  VOLUNTARY_LABEL: 'Sin recompensa',
  NOT_DEFINED: 'no definido',
  ICON_PREFIX: 'icon-',
} as const;

export const ICON_SIZES = {
  VOLUNTARY: 'md',
  DEFAULT: 'sm',
} as const;

export const NUMBER_REGEX = /^\d+$/;
export const PREFIX_REGEX = new RegExp(`^${REWARD_CONFIG.PREFIX}`, 'i');
export const CLEAN_TOKEN_REGEX = /[^a-z0-9]/g;
export const WHITESPACE_REGEX = /\s+/;

export type SupportedBrand = 'aws' | 'github' | 'azure' | 'udemy';

export const BRAND_FA_ICONS: Record<SupportedBrand, IconDefinition> = {
  aws: faAws,
  github: faGithub,
  azure: faMicrosoft,
  udemy: faU,
};

export const BRAND_ALIASES: Record<string, SupportedBrand> = {
  aws: 'aws',
  amazon: 'aws',
  amazonaws: 'aws',
  github: 'github',
  git: 'github',
  azure: 'azure',
  microsoft: 'azure',
  microsoftazure: 'azure',
  udemy: 'udemy',
};



import { Injectable } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IRewards, RewardViewModel } from '../interfaces/rewards.interface';
import {
  REWARD_CONFIG,
  NUMBER_REGEX,
  PREFIX_REGEX,
  CLEAN_TOKEN_REGEX,
  WHITESPACE_REGEX,
  BRAND_FA_ICONS,
  BRAND_ALIASES,
  SupportedBrand,
} from '../constants/rewards.constants';

@Injectable({
  providedIn: 'root',
})
export class AdapterMarketplaceIssuesService {
  public static toViewModel(
    labels: string[] | undefined,
    catalog: Map<string, IRewards>
  ): RewardViewModel {
    const rawReward = this.extractRewardKey(labels);

    if (!rawReward) {
      return {
        label: REWARD_CONFIG.VOLUNTARY_LABEL,
        isVoluntary: true,
        nvIcon: REWARD_CONFIG.VOLUNTARY_ICON,
      };
    }

    const matchKey = this.normalizeMatchKey(rawReward);
    const rewardInfo = catalog.get(matchKey) ?? this.findByTokens(catalog, matchKey);
    const faIcon = this.resolveFontAwesomeIcon(rawReward, matchKey, rewardInfo);

    if (faIcon) {
      return {
        label: this.formatLabel(rawReward),
        isVoluntary: false,
        faIcon,
      };
    }

    const rawLocalIcon = (rewardInfo?.icon ?? matchKey).trim().toLowerCase();
    const cleanLocalIcon = rawLocalIcon.replace(
      new RegExp(`^${REWARD_CONFIG.ICON_PREFIX}`),
      ''
    );

    const nvIcon = cleanLocalIcon
      ? `${REWARD_CONFIG.ICON_PREFIX}${cleanLocalIcon}`
      : REWARD_CONFIG.DEFAULT_ICON;

    return {
      label: this.formatLabel(rawReward),
      isVoluntary: false,
      nvIcon,
    };
  }

  public static extractRewardKey(labels?: string[]): string {
    if (!Array.isArray(labels)) return '';
    return (
      labels.find((item) =>
        item.toLowerCase().startsWith(REWARD_CONFIG.PREFIX.toLowerCase())
      ) ?? ''
    );
  }

  public static normalizeMatchKey(raw: string | null | undefined): string {
    if (!raw || typeof raw !== 'string') return '';

    return raw
      .toLowerCase()
      .replace(PREFIX_REGEX, '')
      .split(REWARD_CONFIG.DELIMITER)
      .filter((token) => Boolean(token) && !NUMBER_REGEX.test(token))
      .sort()
      .join(REWARD_CONFIG.DELIMITER);
  }

  public static formatLabel(raw: string | null | undefined): string {
    if (!raw || typeof raw !== 'string') return REWARD_CONFIG.VOLUNTARY_LABEL;

    if (raw.trim().toLowerCase() === REWARD_CONFIG.NOT_DEFINED) {
      return REWARD_CONFIG.VOLUNTARY_LABEL;
    }

    return raw
      .replace(PREFIX_REGEX, '')
      .split(REWARD_CONFIG.DELIMITER)
      .filter(Boolean)
      .join(REWARD_CONFIG.JOIN_SEPARATOR);
  }

  private static findByTokens(
    catalog: Map<string, IRewards>,
    matchKey: string
  ): IRewards | undefined {
    if (!catalog?.size) return undefined;

    const targetTokens = new Set(matchKey.split(REWARD_CONFIG.DELIMITER));

    return Array.from(catalog.values()).find((item) => {
      const itemTokens = this.normalizeMatchKey(item.rewardName).split(
        REWARD_CONFIG.DELIMITER
      );
      return itemTokens.every((token) => targetTokens.has(token));
    });
  }

  private static resolveFontAwesomeIcon(
    rawReward: string,
    matchKey: string,
    rewardInfo?: IRewards
  ): IconDefinition | undefined {
    const combinedTerms = [
      rewardInfo?.icon,
      rewardInfo?.rewardName,
      matchKey,
      rawReward,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const tokens = combinedTerms
      .replace(new RegExp(REWARD_CONFIG.ICON_PREFIX, 'g'), ' ')
      .replace(CLEAN_TOKEN_REGEX, ' ')
      .split(WHITESPACE_REGEX)
      .filter((token) => Boolean(token) && !NUMBER_REGEX.test(token));

    const matchedBrand = tokens
      .map((token) => BRAND_ALIASES[token] ?? (token as SupportedBrand))
      .find((brand) => brand in BRAND_FA_ICONS);

    return matchedBrand ? BRAND_FA_ICONS[matchedBrand] : undefined;
  }
}


import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarketplaceIssuesService } from './services/marketplace-issues.service';
import { AdapterMarketplaceIssuesService } from './services/adapter-marketplace-issues.service';
import { IContent } from './interfaces/content.interface';
import { ICON_SIZES } from './constants/rewards.constants';

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMarketplaceComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

  public readonly iconSizes = ICON_SIZES;
  public readonly $content = input.required<IContent>();

  public readonly $reward = computed(() =>
    AdapterMarketplaceIssuesService.toViewModel(
      this.$content()?.labels,
      this._issuesService.$rewardsMap()
    )
  );
}


<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().faIcon; as faIcon) {
    <fa-icon [icon]="faIcon" class="reward-fa-icon"></fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
    <nv-icon
      [class]="nvIcon"
      [size]="$reward().isVoluntary ? iconSizes.VOLUNTARY : iconSizes.DEFAULT">
    </nv-icon>
  }

  <div class="nv-display-flex nv-flex-direction-column">
    <span class="bc-opensans-font-style-2-semibold bc-text-brand-primary-00">
      {{ $reward().label }}
    </span>

    @if ($reward().isVoluntary) {
      <span class="bc-opensans-font-style-2-regular bc-text-brand-primary-00">
        (contribución voluntaria)
      </span>
    }
  </div>
</section>


.reward-fa-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;

  :host ::ng-deep & svg {
    width: 1em !important;
    height: 1em !important;
    max-width: 18px;
    max-height: 18px;
    vertical-align: middle;
  }
}
