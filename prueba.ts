// marketplace.adapter.ts
import { IRewards } from './rewards.interface'; //[cite: 5]
import { IContent } from './content.interface'; //

/**
 * Normaliza claves tolerando permutaciones y montos:
 * 'rw:aws-voucher-3000' -> 'aws-voucher'
 * 'rw:voucher-aws-3000' -> 'aws-voucher'
 */
export function getRewardMatchKey(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .toLowerCase()
    .replace(/^rw:/i, '')
    .split('-')
    .filter(token => token && !/^\d+$/.test(token))
    .sort()
    .join('-');
}

/**
 * Genera el label legible conservando el monto:
 * 'rw:aws-voucher-3000' -> 'aws voucher 3000'
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

/**
 * Adapter que transforma un elemento crudo del backend a IContent
 */
export function adaptMarketplaceIssue(
  rawItem: any, 
  rewardsCatalog: Map<string, IRewards>
): IContent {
  const rawGift: string = rawItem.gift; // o el campo que traiga 'rw:aws-voucher-3000'
  const isVoluntary = !rawGift || rawGift.trim().toLowerCase() === 'no definido';

  const matchKey = getRewardMatchKey(rawGift);
  const matchedReward = rewardsCatalog.get(matchKey);

  return {
    ...rawItem,
    // Propiedades calculadas listas para el consumo del card:
    rewardIcon: isVoluntary 
      ? 'icon-hand-handshake' 
      : (matchedReward?.icon ?? 'icon-gift'),
    rewardLabel: isVoluntary 
      ? 'Sin recompensa' 
      : formatRewardLabel(rawGift),
    isVoluntary
  };
}








// marketplace-parent.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { adaptMarketplaceIssue, getRewardMatchKey } from './marketplace.adapter';
import { IRewards } from './rewards.interface'; //[cite: 5]

// ... dentro de tu componente padre:

// 1. Signal para el mapa del catálogo
private $rewardsCatalog = signal<Map<string, IRewards>>(new Map());

ngOnInit(): void {
  // Consumimos el endpoint que ya tienes expuesto (getRewards)
  this._marketplaceIssues.getRewards().subscribe({ //
    next: (rewards) => {
      const catalog = new Map<string, IRewards>();
      for (const item of rewards) {
        catalog.set(getRewardMatchKey(item.rewardName), item);
      }
      this.$rewardsCatalog.set(catalog);
    }
  });
}

// 2. Modificación de tu efecto existente en la captura (línea 125 aprox):
private _setupResponseEffect(): void {
  effect(() => {
    const response = this.resourceIssues.value(); //[cite: 9]
    if (!response) return;

    // ... lógica de paginación existente[cite: 9] ...

    if (response.content?.length) {
      const catalog = this.$rewardsCatalog();

      // Pasamos cada item por el Adapter antes de acumularlo
      const adaptedContent: IContent[] = response.content.map(item => 
        adaptMarketplaceIssue(item, catalog)
      );

      if (response.page === 1) { //[cite: 9]
        this.$accumulatedItems.set([...adaptedContent]); //[cite: 9]
      } else {
        this.$accumulatedItems.update(prev => 
          this._appendWithinWindow(prev, adaptedContent) //[cite: 9]
        );
      }
    } else if (response.page === 1 && response.content?.length === 0) { //[cite: 9]
      this.$accumulatedItems.set([]); //[cite: 9]
    }
  });
}




<!-- card-marketplace.component.html -->
<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  <nv-icon 
    [class]="$content().rewardIcon" 
    [size]="$content().isVoluntary ? 'md' : 'sm'">
  </nv-icon>

  <div class="nv-display-flex nv-flex-direction-column">
    <span class="bc-opensans-font-style-2-semibold bc-text-brand-primary-00">
      {{ $content().rewardLabel }}
    </span>

    @if ($content().isVoluntary) {
      <span class="bc-opensans-font-style-2-regular bc-text-brand-primary-00">
        (contribución voluntaria)
      </span>
    }
  </div>
</section>