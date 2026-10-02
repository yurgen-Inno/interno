// marketplace-reward.utils.ts

/**
 * Busca dentro del array de labels el que inicia por 'rw:'
 */
export function extractRewardFromLabels(labels?: string[]): string {
  if (!labels || !Array.isArray(labels)) return '';
  return labels.find(label => label.toLowerCase().startsWith('rw:')) ?? '';
}

/**
 * Normaliza la clave para buscar en el mapa:
 * 'rw:github-voucher-copilot' -> extrae las palabras clave para encontrar 'github-voucher'
 */
export function getRewardMatchKey(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';

  return raw
    .toLowerCase()
    .replace(/^rw:/i, '')
    .split('-')
    .filter(token => token && !/^\d+$/.test(token)) // descarta números
    .sort()
    .join('-');
}

/**
 * Formatea el texto completo para mostrar:
 * 'rw:github-voucher-copilot' -> 'github voucher copilot'
 */
export function formatRewardLabel(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string' || raw.trim().toLowerCase() === 'no definido') {
    return 'Sin recompensa';
  }

  return raw
    .replace(/^rw:/i, '')
    .split('-')
    .filter(Boolean)
    .join(' ');
}



// Tu servicio actual (donde tienes getRewards)
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRewards } from './rewards.interface'; // Captura 5[cite: 5]
import { environment } from 'src/environments/environment'; // Captura 6[cite: 6]
import { getRewardMatchKey } from './marketplace-reward.utils';

@Injectable({ providedIn: 'root' })
export class MarketplaceIssuesService {
  private _http = inject(HttpClient);

  // Signal accesible por cualquier componente
  public rewardsMap = signal<Map<string, IRewards>>(new Map());

  constructor() {
    // Se ejecuta automáticamente al arrancar la app o servicio
    this.initCatalog();
  }

  public getRewards(): Observable<IRewards[]> {
    return this._http.get<IRewards[]>(
      `${environment.apiBaseUrl}catalog/api/v1/rewards` // Captura 6[cite: 6]
    );
  }

  private initCatalog(): void {
    this.getRewards().subscribe({
      next: (rewards) => {
        const catalog = new Map<string, IRewards>();
        rewards.forEach(item => {
          // Normaliza 'github-voucher' -> 'github-voucher'
          catalog.set(getRewardMatchKey(item.rewardName), item);
        });
        this.rewardsMap.set(catalog);
      },
      error: (err) => console.error('Error cargando catalogo de recompensas', err)
    });
  }
}




// card-marketplace.component.ts (Captura 7)
import { Component, computed, inject, input } from '@angular/core';
import { IContent } from './content.interface'; //[cite: 7]
import { 
  extractRewardFromLabels, 
  getRewardMatchKey, 
  formatRewardLabel 
} from './marketplace-reward.utils';
import { MarketplaceIssuesService } from './marketplace-issues.service'; // Tu servicio de la captura 6[cite: 6]

export class CardMarketplaceComponent {
  private _issuesService = inject(MarketplaceIssuesService);

  public type: StatusType = 'only'; //[cite: 7]
  public border: StatusBorder = 'center'; //[cite: 7]
  public radius: StatusRadius = 'radius-16'; //[cite: 7]
  public $content = input.required<IContent>(); //[cite: 7]

  public $reward = computed(() => {
    const content = this.$content();
    
    // 1. Extraer la cadena 'rw:...' del arreglo 'labels' (Captura 10)
    const rawReward = extractRewardFromLabels((content as any)?.labels); //

    // Si no trae ningún label con 'rw:', es contribución voluntaria
    if (!rawReward) {
      return {
        icon: 'icon-hand-handshake', //
        label: 'Sin recompensa', //[cite: 2]
        isVoluntary: true
      };
    }

    // 2. Buscar en el catálogo
    const catalog = this._issuesService.rewardsMap();
    const matchKey = getRewardMatchKey(rawReward);

    // Búsqueda directa o por coincidencia parcial si trae sub-tokens como '-copilot'
    let rewardInfo = catalog.get(matchKey);

    if (!rewardInfo && catalog.size > 0) {
      // Si matchKey es 'copilot-github-voucher', busca en el catálogo la recompensa que encaje
      for (const [key, item] of catalog.entries()) {
        const tokens = key.split('-');
        if (tokens.every(token => matchKey.includes(token))) {
          rewardInfo = item;
          break;
        }
      }
    }

    return {
      icon: rewardInfo?.icon ?? 'icon-gift', // Icono del backend o fallback
      label: formatRewardLabel(rawReward),   // Muestra: "github voucher copilot"
      isVoluntary: false
    };
  });
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