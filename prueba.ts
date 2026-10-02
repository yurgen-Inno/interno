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

export const NUMBER_REGEX = /^\d+$/;
export const PREFIX_REGEX = new RegExp(`^${REWARD_CONFIG.PREFIX}`, 'i');

/** Iconos SVG oficiales de FontAwesome disponibles */
export const BRAND_FA_ICONS: Record<string, IconDefinition> = {
  aws: faAws,
  github: faGithub,
  azure: faMicrosoft,
  udemy: faU,
};

/** Mapeo de términos/tokens alternativos hacia la clave canónica de FontAwesome */
export const BRAND_ALIASES: Record<string, string> = {
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
  BRAND_FA_ICONS,
  BRAND_ALIASES,
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

    // Intentamos resolver el icono de FontAwesome por tokens
    const faIcon = this.resolveFontAwesomeIcon(rawReward, matchKey, rewardInfo);

    if (faIcon) {
      return {
        label: this.formatLabel(rawReward),
        isVoluntary: false,
        faIcon,
      };
    }

    // Fallback: Resuelve icono interno de Design System (nv-icon)
    const localIconName = (rewardInfo?.icon ?? matchKey).trim().toLowerCase();
    const cleanLocalIcon = localIconName.replace(
      new RegExp(`^${REWARD_CONFIG.ICON_PREFIX}`),
      ''
    );

    return {
      label: this.formatLabel(rawReward),
      isVoluntary: false,
      nvIcon: `${REWARD_CONFIG.ICON_PREFIX}${cleanLocalIcon}` || REWARD_CONFIG.DEFAULT_ICON,
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
    if (!catalog || catalog.size === 0) return undefined;

    const targetTokens = new Set(matchKey.split(REWARD_CONFIG.DELIMITER));

    for (const item of catalog.values()) {
      const itemTokens = this.normalizeMatchKey(item.rewardName).split(
        REWARD_CONFIG.DELIMITER
      );
      const isMatch = itemTokens.every((token) => targetTokens.has(token));
      if (isMatch) return item;
    }

    return undefined;
  }

  /**
   * Extrae los tokens de todas las fuentes disponibles y busca coincidencias con FontAwesome
   */
  private static resolveFontAwesomeIcon(
    rawReward: string,
    matchKey: string,
    rewardInfo?: IRewards
  ): IconDefinition | undefined {
    // Une todas las fuentes posibles de información textual
    const combinedTerms = [
      rewardInfo?.icon,
      rewardInfo?.rewardName,
      matchKey,
      rawReward,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Divide en tokens limpios alfanuméricos ignorando prefijos
    const tokens = combinedTerms
      .replace(new RegExp(REWARD_CONFIG.ICON_PREFIX, 'g'), ' ')
      .replace(/[^a-z0-9]/g, ' ')
      .split(/\s+/)
      .filter((t) => Boolean(t) && !NUMBER_REGEX.test(t));

    // Busca si alguno de los tokens es una marca conocida
    for (const token of tokens) {
      const canonicalKey = BRAND_ALIASES[token];
      if (canonicalKey && BRAND_FA_ICONS[canonicalKey]) {
        return BRAND_FA_ICONS[canonicalKey];
      }
    }

    return undefined;
  }
}





<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().faIcon; as faIcon) {
    <fa-icon [icon]="faIcon" class="bc-text-lg"></fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
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








<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().faIcon; as faIcon) {
    <fa-icon [icon]="faIcon" class="bc-text-lg"></fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
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






@import '@fortawesome/fontawesome-svg-core/styles.css';

:host ::ng-deep {
  fa-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem; /* Equivalente a bc-text-lg (18px) */
    line-height: 1;

    svg {
      width: 1em !important;
      height: 1em !important;
      max-width: 18px;
      max-height: 18px;
      vertical-align: middle;
    }
  }
}