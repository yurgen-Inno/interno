// marketplace-reward.utils.ts

/**
 * Normaliza la clave para buscar en el catálogo:
 * Quita 'rw:', ignora números (ej. montos 3000) y ordena alfabéticamente.
 * 'rw:aws-voucher-3000' -> 'aws-voucher'
 * 'rw:voucher-aws'      -> 'aws-voucher'
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
 * Formatea todo el texto legible para la vista conservando el monto.
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



// En tu servicio actual (donde está getRewards)
import { signal } from '@angular/core';
import { IRewards } from './rewards.interface'; // Captura 5[cite: 5]
import { getRewardMatchKey } from './marketplace-reward.utils';

// Dentro de la clase del servicio:

// 1. Signal que almacenará el mapa en memoria
public rewardsMap = signal<Map<string, IRewards>>(new Map());

// 2. Método que ya tenías en la captura 6[cite: 6]
public getRewards(): Observable<IRewards[]> {
  return this._http.get<IRewards[]>(
    `${environment.apiBaseUrl}catalog/api/v1/rewards`[cite: 6]
  );
}

// 3. Método para precargar el catálogo indexado
public loadRewardsCatalog(): void {
  this.getRewards().subscribe({
    next: (rewards) => {
      const catalog = new Map<string, IRewards>();
      rewards.forEach(item => {
        catalog.set(getRewardMatchKey(item.rewardName), item);
      });
      this.rewardsMap.set(catalog);
    },
    error: (err) => console.error('Error al cargar catálogo de recompensas', err)
  });
}




// Componente Padre (captura 9)
constructor() {
  // Lanza la petición del catálogo una sola vez en segundo plano
  this._marketplaceIssues.loadRewardsCatalog();

  // El resto de tus listeners originales intactos:[cite: 9]
  this._setupViewportResizeListener();[cite: 9]
  this._setupFilterResetEffect();[cite: 9]
  this._setupLoadingEffect();[cite: 9]
  this._setupResponseEffect();[cite: 9]
}





// card-marketplace.component.ts (Captura 7)
import { Component, computed, inject, input } from '@angular/core';
import { IContent } from './content.interface'; // Tu interfaz[cite: 7]
import { getRewardMatchKey, formatRewardLabel } from './marketplace-reward.utils';
import { TuServicioActual } from './tu-servicio-actual.service'; // Tu servicio de la captura 6

@Component({
  selector: 'app-card-marketplace',
  // ... resto de tu configuración
})
export class CardMarketplaceComponent {
  private _issuesService = inject(TuServicioActual);

  public type: StatusType = 'only';[cite: 7]
  public border: StatusBorder = 'center';[cite: 7]
  public radius: StatusRadius = 'radius-16';[cite: 7]
  public $content = input.required<IContent>();[cite: 7]

  // Computed que calcula reactivamente los datos de la recompensa
  public $reward = computed(() => {
    const content = this.$content();
    // Ajusta si la propiedad se llama gift o reward en tu IContent:
    const rawGift = (content as any)?.gift ?? (content as any)?.reward ?? '';
    const isVoluntary = !rawGift || rawGift.trim().toLowerCase() === 'no definido';[cite: 1, 2]

    if (isVoluntary) {
      return {
        icon: 'icon-hand-handshake',[cite: 2]
        label: 'Sin recompensa',[cite: 2]
        isVoluntary: true
      };
    }

    const catalog = this._issuesService.rewardsMap();
    const matchKey = getRewardMatchKey(rawGift);
    const rewardInfo = catalog.get(matchKey);

    return {
      icon: rewardInfo?.icon ?? 'icon-gift',[cite: 1, 5]
      label: formatRewardLabel(rawGift), // Ejemplo: 'aws voucher 3000'
      isVoluntary: false
    };
  });
}



<!-- card-marketplace.component.html -->
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