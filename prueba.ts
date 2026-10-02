// card-marketplace.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent } from './content.interface'; // Tu interfaz existente[cite: 7]
import { 
  extractRewardFromLabels, 
  getRewardMatchKey, 
  formatRewardLabel 
} from './marketplace-reward.utils';
import { MarketplaceIssuesService } from './marketplace-issues.service'; // Tu servicio de la captura 6[cite: 6]

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss']
})
export class CardMarketplaceComponent {
  // 1. Inyectamos el servicio
  private _issuesService = inject(MarketplaceIssuesService);

  // Tus propiedades existentes (Captura 7)[cite: 7]
  public type: StatusType = 'only';[cite: 7]
  public border: StatusBorder = 'center';[cite: 7]
  public radius: StatusRadius = 'radius-16';[cite: 7]
  public $content = input.required<IContent>();[cite: 7]

  // 2. Aquí ubicas el computed
  public $reward = computed(() => {
    const content = this.$content();
    
    // Extrae la etiqueta que empieza por 'rw:' del arreglo labels[cite: 10]
    const rawReward = extractRewardFromLabels((content as any)?.labels);[cite: 10]

    // Si no tiene etiqueta 'rw:', es voluntaria
    if (!rawReward) {
      return {
        icon: 'icon-hand-handshake',[cite: 2]
        label: 'Sin recompensa',[cite: 2]
        isVoluntary: true
      };
    }

    // Buscamos en el catálogo reactivo
    const catalog = this._issuesService.rewardsMap();
    const matchKey = getRewardMatchKey(rawReward);

    let rewardInfo = catalog.get(matchKey);

    // Búsqueda por sub-tokens en caso de sufijos (ej. '-copilot')[cite: 10]
    if (!rewardInfo && catalog.size > 0) {
      for (const [key, item] of catalog.entries()) {
        const tokens = key.split('-');
        if (tokens.every(token => matchKey.includes(token))) {
          rewardInfo = item;
          break;
        }
      }
    }

    // Asegura el prefijo 'icon-' por si el backend mandó solo el nombre corto
    const rawIcon = rewardInfo?.icon ?? 'icon-gift';[cite: 1, 5]
    const resolvedIcon = rawIcon.startsWith('icon-') ? rawIcon : `icon-${rawIcon}`;

    return {
      icon: resolvedIcon,
      label: formatRewardLabel(rawReward), // Texto legible con el monto o subtipo[cite: 10]
      isVoluntary: false
    };
  });
}