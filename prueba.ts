// marketplace-reward.adapter.ts

export class MarketplaceRewardAdapter {
  // ... resto del adapter igual ...

  // Modifica solo este método privado:
  private static resolveIconName(iconName?: string): string {
    if (!iconName) {
      return REWARD_CONFIG.DEFAULT_ICON; // 'icon-gift'
    }
    // Devolvemos el nombre tal cual viene en el JSON ('aws', 'azure', 'github', etc.)
    return iconName.trim().toLowerCase();
  }
}



// card-marketplace.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent } from './content.interface';[cite: 7]
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { MarketplaceRewardAdapter } from './marketplace-reward.adapter';

const BRAND_SLUGS: Record<string, string> = {
  'aws': 'amazonaws',
  'amazon': 'amazonaws',
  'github': 'github',[cite: 1, 5]
  'azure': 'microsoftazure',
  'microsoft-azure': 'microsoftazure',
  'udemy': 'udemy',[cite: 1]
};

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule],[cite: 7]
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss'],
})
export class CardMarketplaceComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

  public $content = input.required<IContent>();[cite: 7]

  public readonly $reward = computed(() =>
    MarketplaceRewardAdapter.toViewModel(
      this.$content()?.labels,[cite: 10]
      this._issuesService.$rewardsMap()
    )
  );

  // Es web solo si NO empieza por 'icon-' y NO es de los internos (ej: puntos-colombia)
  public readonly $isWebIcon = computed(() => {
    const icon = this.$reward().icon?.toLowerCase().trim();
    if (!icon) return false;
    if (icon.startsWith('icon-') || icon === 'puntos-colombia') {
      return false;[cite: 1, 2]
    }
    return true;
  });

  // URL al CDN oficial
  public readonly $webIconUrl = computed(() => {
    const raw = this.$reward().icon?.toLowerCase().trim();
    const slug = BRAND_SLUGS[raw] ?? raw;
    return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
  });
}



<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().isVoluntary) {
    <!-- Recompensa voluntaria -->
    <nv-icon class="icon-hand-handshake" size="md"></nv-icon> <!--[cite: 2] -->
  } @else if ($isWebIcon()) {
    <!-- Icono Web (AWS, Azure, Github, Udemy) -->
    <img 
      [src]="$webIconUrl()" 
      [alt]="$reward().label"
      class="reward-cdn-icon"
      loading="lazy"
    />
  } @else {
    <!-- Icono Interno (puntos-colombia o fallback default) -->
    <nv-icon 
      [class]="$reward().icon.startsWith('icon-') ? $reward().icon : 'icon-' + $reward().icon" 
      size="sm">
    </nv-icon> <!--[cite: 1, 2] -->
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