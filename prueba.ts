// marketplace.adapter.ts
import { IRewards } from './rewards.interface'; // Tu interfaz de la captura 5
import { IContent } from './content.interface'; // Tu interfaz de la captura 7

/**
 * Normaliza claves tolerando sufijos de montos y permutaciones:
 * 'rw:aws-voucher-3000' -> 'aws-voucher'
 * 'rw:voucher-aws'      -> 'aws-voucher'
 */
export function getRewardMatchKey(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return '';

  return raw
    .toLowerCase()
    .replace(/^rw:/i, '')
    .split('-')
    .filter(token => token && !/^\d+$/.test(token)) // Elimina montos numéricos (3000, etc.)
    .sort()                                         // Orden simétrico invariable
    .join('-');
}

/**
 * Formatea el texto visible conservando todo el contenido:
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
 * Transforma un elemento crudo del backend en el contrato IContent
 */
export function adaptMarketplaceIssue(
  rawItem: any,
  catalog: Map<string, IRewards>
): IContent {
  // Ajusta 'gift' por el nombre del campo exacto que viene del backend
  const rawGift: string = rawItem.gift ?? rawItem.reward ?? '';
  const isVoluntary = !rawGift || rawGift.trim().toLowerCase() === 'no definido';

  if (isVoluntary) {
    return {
      ...rawItem,
      rewardIcon: 'icon-hand-handshake',
      rewardLabel: 'Sin recompensa',
      isVoluntary: true
    };
  }

  const matchKey = getRewardMatchKey(rawGift);
  const rewardData = catalog.get(matchKey);

  return {
    ...rawItem,
    rewardIcon: rewardData?.icon ?? 'icon-gift',
    rewardLabel: formatRewardLabel(rawGift),
    isVoluntary: false
  };
}













// Tu componente padre (captura 9)
import { Component, effect, OnInit, signal, inject } from '@angular/core';
import { IRewards } from './rewards.interface'; //[cite: 5]
import { IContent } from './content.interface'; //
import { adaptMarketplaceIssue, getRewardMatchKey } from './marketplace.adapter';

// ... dentro de tu clase:

// Signal en memoria para el catálogo O(1)
private $rewardsCatalog = signal<Map<string, IRewards>>(new Map());

ngOnInit(): void {
  // Consumir el endpoint que ya tienes listo en tu servicio (captura 6)
  this._marketplaceIssues.getRewards().subscribe({ //[cite: 6]
    next: (rewards: IRewards[]) => {
      const mapCatalog = new Map<string, IRewards>();
      rewards.forEach(item => {
        // Indexamos por la clave normalizada (ej: 'aws-voucher')
        mapCatalog.set(getRewardMatchKey(item.rewardName), item);
      });
      this.$rewardsCatalog.set(mapCatalog);
    }
  });
}

// Modificación puntual de tu método existente _setupResponseEffect (línea 125 captura 9):
private _setupResponseEffect(): void {
  effect(() => {
    const response = this.resourceIssues.value(); //[cite: 9]
    if (!response) return;

    // ... lógica de totalPages y cálculo existente ...[cite: 9]

    if (response.content?.length) {
      const catalog = this.$rewardsCatalog();

      // Mapeamos los datos con el adapter antes de guardarlos
      const adaptedItems: IContent[] = response.content.map(item =>
        adaptMarketplaceIssue(item, catalog)
      );

      if (response.page === 1) { //[cite: 9]
        this.$accumulatedItems.set([...adaptedItems]); //[cite: 9]
      } else {
        this.$accumulatedItems.update(prev =>
          this._appendWithinWindow(prev, adaptedItems) //[cite: 9]
        );
      }
    } else if (response.page === 1 && response.content?.length === 0) { //[cite: 9]
      this.$accumulatedItems.set([]); //[cite: 9]
    }
  });
}









// card-marketplace.component.ts (captura 7)
export class CardMarketplaceComponent {
  public type: StatusType = 'only'; //[cite: 7]
  public border: StatusBorder = 'center'; //[cite: 7]
  public radius: StatusRadius = 'radius-16'; //[cite: 7]
  public $content = input.required<IContent>(); //[cite: 7]
}




<!-- card-marketplace.component.html -->
<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  <nv-icon 
    [class]="$content().rewardIcon!" 
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