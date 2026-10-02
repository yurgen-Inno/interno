// marketplace-rewards.constant.ts

export const REWARD_CONFIG = {
  PREFIX: 'rw:',
  DEFAULT_ICON: 'icon-gift',
  VOLUNTARY_ICON: 'icon-hand-handshake',
  VOLUNTARY_LABEL: 'Sin recompensa',
  NOT_DEFINED: 'no definido',
  ICON_PREFIX: 'icon-',
  DELIMITER: '-',
  JOIN_SEPARATOR: ' ',
  EMPTY_SIZE: 0,
} as const;


// marketplace-reward.adapter.ts
import { IRewards } from './rewards.interface'; // Tu interfaz existente (Captura 5)
import { REWARD_CONFIG } from './marketplace-rewards.constant';

export interface RewardViewModel {
  icon: string;
  label: string;
  isVoluntary: boolean;
}

export class MarketplaceRewardAdapter {
  private static readonly NUMBER_REGEX = /^\d+$/;

  /**
   * Transforma las etiquetas del issue y el catálogo a un modelo listo para la UI
   */
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
    const resolvedIcon = this.resolveIconName(rewardInfo?.icon);

    return {
      icon: resolvedIcon,
      label: this.formatLabel(rawReward),
      isVoluntary: false,
    };
  }

  /**
   * Extrae la etiqueta que inicia por 'rw:'
   */
  public static extractRewardKey(labels?: string[]): string {
    if (!Array.isArray(labels)) return '';
    return labels.find(label => 
      label.toLowerCase().startsWith(REWARD_CONFIG.PREFIX)
    ) ?? '';
  }

  /**
   * Normaliza tokens ignorando montos y ordenando alfabéticamente
   */
  public static normalizeMatchKey(raw: string | null | undefined): string {
    if (!raw || typeof raw !== 'string') return '';

    return raw
      .toLowerCase()
      .replace(new RegExp(`^${REWARD_CONFIG.PREFIX}`, 'i'), '')
      .split(REWARD_CONFIG.DELIMITER)
      .filter(token => Boolean(token) && !this.NUMBER_REGEX.test(token))
      .sort()
      .join(REWARD_CONFIG.DELIMITER);
  }

  /**
   * Formatea el texto visible conservando montos y subtipos
   */
  public static formatLabel(raw: string | null | undefined): string {
    if (!raw || typeof raw !== 'string' || raw.trim().toLowerCase() === REWARD_CONFIG.NOT_DEFINED) {
      return REWARD_CONFIG.VOLUNTARY_LABEL;
    }

    return raw
      .replace(new RegExp(`^${REWARD_CONFIG.PREFIX}`, 'i'), '')
      .split(REWARD_CONFIG.DELIMITER)
      .filter(Boolean)
      .join(REWARD_CONFIG.JOIN_SEPARATOR);
  }

  private static resolveIconName(iconName?: string): string {
    const rawIcon = iconName ?? REWARD_CONFIG.DEFAULT_ICON;
    return rawIcon.startsWith(REWARD_CONFIG.ICON_PREFIX)
      ? rawIcon
      : `${REWARD_CONFIG.ICON_PREFIX}${rawIcon}`;
  }

  private static findByTokens(catalog: Map<string, IRewards>, matchKey: string): IRewards | undefined {
    if (catalog.size === REWARD_CONFIG.EMPTY_SIZE) {
      return undefined;
    }

    for (const [key, item] of catalog.entries()) {
      const tokens = key.split(REWARD_CONFIG.DELIMITER);
      const isMatch = tokens.every(token => matchKey.includes(token));
      if (isMatch) {
        return item;
      }
    }

    return undefined;
  }
}



// marketplace-issues.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';[cite: 6, 11]
import { IRewards } from './rewards.interface'; // Captura 5[cite: 5]
import { MarketplaceRewardAdapter } from './marketplace-reward.adapter';
// Importa tus otras interfaces existentes (IResponseListIssues, etc.)[cite: 11]

@Injectable({ providedIn: 'root' })
export class MarketplaceIssuesService {
  private readonly _http = inject(HttpClient);[cite: 11]

  // Flujo reactivo cacheado del catálogo
  public readonly rewardsCatalog$: Observable<Map<string, IRewards>> = this.getRewards().pipe(
    map(rewards => {
      const catalog = new Map<string, IRewards>();
      rewards.forEach(item => {
        const key = MarketplaceRewardAdapter.normalizeMatchKey(item.rewardName);
        catalog.set(key, item);
      });
      return catalog;
    }),
    catchError(err => {
      console.error('Error al obtener el catálogo de recompensas', err);
      return of(new Map<string, IRewards>());
    }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Signal de solo lectura expuesto para los componentes (sin constructor)
  public readonly rewardsMap = toSignal(this.rewardsCatalog$, {
    initialValue: new Map<string, IRewards>(),
  });

  // Tus métodos existentes intactos (Captura 11):[cite: 11]
  public getListIssues(
    params: Record<string, string | number>
  ): Observable<IResponseListIssues> {[cite: 11]
    const url = buildApiUrl(
      `http://localhost:3000/catalog/api/v1/${environment.organization}/issues`,[cite: 11]
      params
    );
    return this._http.get<IResponseListIssues>(url);[cite: 11]
  }

  public getFilters(): Observable<IResponseFilters> {[cite: 11]
    return this._http.get<IResponseFilters>(
      `${environment.apiBaseUrl}catalog/api/v1/.../issues/filters`[cite: 11]
    );
  }

  public getTopContributors(): Observable<ITopContributors[]> {[cite: 11]
    return this._http.get<ITopContributors[]>(
      `${environment.apiBaseUrl}catalog/api/v1/contributors/top`[cite: 11]
    );
  }

  public getRewards(): Observable<IRewards[]> {[cite: 6, 11]
    return this._http.get<IRewards[]>(
      `${environment.apiBaseUrl}catalog/api/v1/rewards`[cite: 6, 11]
    );
  }
}




// card-marketplace.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent } from './content.interface';[cite: 7]
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { MarketplaceRewardAdapter } from './marketplace-reward.adapter';

export type StatusType = 'only';[cite: 7]
export type StatusBorder = 'center';[cite: 7]
export type StatusRadius = 'radius-16';[cite: 7]

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss'],
})
export class CardMarketplaceComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

  public type: StatusType = 'only';[cite: 7]
  public border: StatusBorder = 'center';[cite: 7]
  public radius: StatusRadius = 'radius-16';[cite: 7]
  public $content = input.required<IContent>();[cite: 7]

  // Delegación al Adapter
  public readonly $reward = computed(() =>
    MarketplaceRewardAdapter.toViewModel(
      this.$content()?.labels,[cite: 10]
      this._issuesService.rewardsMap()
    )
  );
}


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
