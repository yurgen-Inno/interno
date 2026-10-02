import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAws, faGithub, faMicrosoft, faUdemy } from '@fortawesome/free-brands-svg-icons';

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

export const BRAND_FA_ICONS: Record<string, IconDefinition> = {
  aws: faAws,
  github: faGithub,
  azure: faMicrosoft,
  udemy: faUdemy,
};




import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface IRewards {
  description: string;
  icon: string;
  rewardName: string;
}

export interface RewardViewModel {
  label: string;
  isVoluntary: boolean;
  nvIcon?: string;
  faIcon?: IconDefinition;
}

export interface IContent {
  labels?: string[];
  rewardIcon?: string;
  rewardLabel?: string;
  isVoluntary?: boolean;
}




import { IRewards, RewardViewModel } from './rewards.model';
import { BRAND_FA_ICONS, REWARD_CONFIG } from './reward.config';

const NUMBER_REGEX = /^\d+$/;
const PREFIX_REGEX = new RegExp(`^${REWARD_CONFIG.PREFIX}`, 'i');

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
    const iconKey = (rewardInfo?.icon ?? matchKey).trim().toLowerCase();

    // 1. Si es una marca registrada en Font Awesome
    if (BRAND_FA_ICONS[iconKey]) {
      return {
        label: this.formatLabel(rawReward),
        isVoluntary: false,
        faIcon: BRAND_FA_ICONS[iconKey],
      };
    }

    // 2. Si es icono interno del Design System (nv-icon)
    const nvIconName = iconKey.startsWith(REWARD_CONFIG.ICON_PREFIX)
      ? iconKey
      : `${REWARD_CONFIG.ICON_PREFIX}${iconKey}`;

    return {
      label: this.formatLabel(rawReward),
      isVoluntary: false,
      nvIcon: nvIconName || REWARD_CONFIG.DEFAULT_ICON,
    };
  }

  public static extractRewardKey(labels?: string[]): string {
    if (!Array.isArray(labels)) return '';
    return labels.find((l) => l.toLowerCase().startsWith(REWARD_CONFIG.PREFIX)) ?? '';
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
    if (!catalog || catalog.size === 0) return undefined;

    const targetTokens = new Set(matchKey.split(REWARD_CONFIG.DELIMITER));

    for (const item of catalog.values()) {
      const itemTokens = this.normalizeMatchKey(item.rewardName).split(REWARD_CONFIG.DELIMITER);
      const isMatch = itemTokens.every((token) => targetTokens.has(token));
      if (isMatch) return item;
    }

    return undefined;
  }
}



import { Component, computed, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { AdapterMarketplaceIssuesService } from './adapter-marketplace-issues.service';
import { IContent } from './rewards.model';

@Component({
  selector: 'app-reward-badge',
  standalone: true,
  imports: [FontAwesomeModule], // Agrega también tu NvIconModule aquí
  templateUrl: './reward-badge.component.html',
})
export class RewardBadgeComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

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
    <!-- Icono de Marca (Font Awesome) -->
    <fa-icon [icon]="faIcon" class="bc-text-lg"></fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
    <!-- Icono Interno (Design System / Voluntario) -->
    <nv-icon 
      [class]="nvIcon" 
      [size]="$reward().isVoluntary ? 'md' : 'sm'">
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