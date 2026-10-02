import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent } from './content.interface'; //[cite: 7]
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { MarketplaceRewardAdapter } from './marketplace-reward.adapter';

// Mapeo oficial de slugs de marcas para Simple Icons
const BRAND_SLUGS: Record<string, string> = {
  aws: 'amazonaws',
  github: 'github', //
  azure: 'microsoftazure',
  udemy: 'udemy', //[cite: 1]
};

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule], // Tu configuración original intacta[cite: 7]
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss'],
})
export class CardMarketplaceComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

  public $content = input.required<IContent>(); //[cite: 7]

  // Adapter base
  public readonly $reward = computed(() =>
    MarketplaceRewardAdapter.toViewModel(
      this.$content()?.labels,
      this._issuesService.$rewardsMap()
    )
  );

  // Determina si es una marca que debe ir por la web
  public readonly $isWebIcon = computed(() => {
    const icon = this.$reward().icon?.toLowerCase();
    // Si empieza por 'icon-' (ej: icon-hand-handshake, icon-gift, icon-puntos-colombia) es de tu librería
    if (!icon || icon.startsWith('icon-') || icon === 'puntos-colombia') {
      return false; //
    }
    return true;
  });

  // URL del CDN de Simple Icons
  public readonly $webIconUrl = computed(() => {
    const rawIcon = this.$reward().icon?.toLowerCase().trim();
    const slug = BRAND_SLUGS[rawIcon] ?? rawIcon;
    return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
  });
}



<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().isVoluntary) {
    <!-- Caso voluntario: tu nv-icon original intacto -->
    <nv-icon class="icon-hand-handshake" size="md"></nv-icon> <!--[cite: 2] -->
  } @else if ($isWebIcon()) {
    <!-- Caso iconos de la web (AWS, Azure, Github, Udemy) -->
    <img 
      [src]="$webIconUrl()" 
      [alt]="$reward().label"
      class="reward-cdn-icon"
      loading="lazy"
    />
  } @else {
    <!-- Caso icono de tu librería interna (puntos-colombia, fallback gift) -->
    <nv-icon [class]="$reward().icon" size="sm"></nv-icon> <!--[cite: 1, 2] -->
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




.reward-cdn-icon {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  display: inline-block;
  object-fit: contain;
  vertical-align: middle;
}