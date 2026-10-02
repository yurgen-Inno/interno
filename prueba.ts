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

// Un solo mapa unificado de iconos instalados/mapeados
export const BRAND_ICON_MAP: Record<string, string> = {
  aws: 'icon-amazonaws',
  github: 'icon-github',
  azure: 'icon-microsoftazure',
  udemy: 'icon-udemy',
  'puntos-colombia': 'icon-puntos-colombia',
};



export interface IRewards {
  description: string;
  icon: string;
  totalCommits: number;
}

export interface RewardViewModel {
  icon: string;
  label: string;
  isVoluntary: boolean;
}

export interface IContent {
  labels?: string[];
  rewardIcon?: string;
  rewardLabel?: string;
  isVoluntary?: boolean; // Corregido de string a boolean
  // ... resto de propiedades existentes
}


import { IRewards, RewardViewModel } from './rewards.model';
import { BRAND_ICON_MAP, REWARD_CONFIG } from './reward.config';

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
        icon: REWARD_CONFIG.VOLUNTARY_ICON,
        label: REWARD_CONFIG.VOLUNTARY_LABEL,
        isVoluntary: true,
      };
    }

    const matchKey = this.normalizeMatchKey(rawReward);
    const rewardInfo = catalog.get(matchKey) ?? this.findByTokens(catalog, matchKey);
    const resolvedIcon = this.resolveIcon(rewardInfo?.icon ?? matchKey);

    return {
      icon: resolvedIcon,
      label: this.formatLabel(rawReward),
      isVoluntary: false,
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

    const trimmed = raw.trim().toLowerCase();
    if (trimmed === REWARD_CONFIG.NOT_DEFINED) {
      return REWARD_CONFIG.VOLUNTARY_LABEL;
    }

    return raw
      .replace(PREFIX_REGEX, '')
      .split(REWARD_CONFIG.DELIMITER)
      .filter(Boolean)
      .join(REWARD_CONFIG.JOIN_SEPARATOR);
  }

  /**
   * Resuelve el nombre del icono final (añadiendo el prefijo icon- o mapeándolo de BRAND_ICON_MAP).
   */
  private static resolveIcon(iconName?: string): string {
    if (!iconName) return REWARD_CONFIG.DEFAULT_ICON;

    const normalized = iconName.trim().toLowerCase();

    // 1. Si coincide con una marca registrada en BRAND_ICON_MAP
    if (BRAND_ICON_MAP[normalized]) {
      return BRAND_ICON_MAP[normalized];
    }

    // 2. Si ya viene con el prefijo 'icon-'
    if (normalized.startsWith(REWARD_CONFIG.ICON_PREFIX)) {
      return normalized;
    }

    // 3. Fallback agregando el prefijo
    return `${REWARD_CONFIG.ICON_PREFIX}${normalized}`;
  }

  private static findByTokens(
    catalog: Map<string, IRewards>,
    matchKey: string
  ): IRewards | undefined {
    if (!catalog || catalog.size === 0) return undefined;

    const targetTokens = new Set(matchKey.split(REWARD_CONFIG.DELIMITER));

    for (const [key, item] of catalog.entries()) {
      const tokens = key.split(REWARD_CONFIG.DELIMITER);
      // Coincidencia exacta de tokens para evitar falsos positivos
      const isMatch = tokens.every((token) => targetTokens.has(token));
      if (isMatch) return item;
    }

    return undefined;
  }
}

import { Component, computed, inject, input } from '@angular/core';
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { AdapterMarketplaceIssuesService } from './adapter-marketplace-issues.service';
import { IContent } from './rewards.model';

@Component({
  selector: 'app-reward-badge',
  templateUrl: './reward-badge.component.html',
  standalone: true,
  // imports: [NvIconModule, ...]
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
}AdapterMarketplaceIssuesService

<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  <nv-icon 
    [class]="$reward().icon" 
    [size]="$reward().isVoluntary ? 'md' : 'sm'">
  </nv-icon>

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