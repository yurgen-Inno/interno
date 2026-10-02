// marketplace-rewards.constant.ts
export const REWARD_CONFIG = {
  PREFIX: 'rw:',
  DEFAULT_ICON: 'icon-gift',[cite: 1]
  VOLUNTARY_ICON: 'icon-hand-handshake',[cite: 2]
  VOLUNTARY_LABEL: 'Sin recompensa',[cite: 2]
  NOT_DEFINED: 'no definido',[cite: 1]
  ICON_PREFIX: 'icon-',
  DELIMITER: '-',[cite: 1]
  JOIN_SEPARATOR: ' ',[cite: 1]
  EMPTY_SIZE: 0,
} as const;

// Mapeo del slug que viene del backend -> slug oficial en Simple Icons
export const BRAND_ICON_WEB_MAP: Record<string, string> = {
  'aws': 'amazonaws',
  'amazon': 'amazonaws',
  'github': 'github',
  'azure': 'microsoftazure',
  'microsoft-azure': 'microsoftazure',
  'udemy': 'udemy',
};

// Íconos que sí existen en tu librería nativa (<nv-icon>) y no deben ir a la web
export const INTERNAL_CUSTOM_ICONS = new Set<string>([
  'puntos-colombia', // o 'icon-puntos-colombia' según cómo llegue en el JSON
]);



// reward-icon.component.ts
import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  REWARD_CONFIG, 
  BRAND_ICON_WEB_MAP, 
  INTERNAL_CUSTOM_ICONS 
} from './marketplace-rewards.constant';

@Component({
  selector: 'app-reward-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (hasLoadError() || isInternalIcon()) {
      <!-- Renderiza con tu librería interna nv-icon -->
      <nv-icon 
        [class]="resolvedInternalClass()" 
        [size]="size()">
      </nv-icon>
    } @else {
      <!-- Renderiza la marca externa desde la web vía CDN oficial -->
      <img 
        [src]="cdnUrl()" 
        [alt]="cleanName()" 
        (error)="onImageError()"
        class="reward-web-icon"
        [class.icon-sm]="size() === 'sm'"
        [class.icon-md]="size() === 'md'"
        loading="lazy"
      />
    }
  `,
  styles: [`
    .reward-web-icon {
      display: inline-block;
      vertical-align: middle;
      object-fit: contain;
    }
    .icon-sm {
      width: 1.25rem;
      height: 1.25rem;
    }
    .icon-md {
      width: 1.5rem;
      height: 1.5rem;
    }
  `]
})
export class RewardIconComponent {
  public iconName = input.required<string>();
  public size = input<'sm' | 'md'>('sm');

  public hasLoadError = signal(false);

  public cleanName = computed(() => {
    return this.iconName()?.trim().toLowerCase() ?? '';
  });

  // Determina si debe usar nv-icon
  public isInternalIcon = computed(() => {
    const name = this.cleanName();
    if (!name) return true;

    // Si viene con prefijo icon- o está en la lista de los que sí tienes en tu librería
    return name.startsWith(REWARD_CONFIG.ICON_PREFIX) || INTERNAL_CUSTOM_ICONS.has(name);
  });

  // Resuelve la clase CSS adecuada para nv-icon
  public resolvedInternalClass = computed(() => {
    if (this.hasLoadError()) {
      return REWARD_CONFIG.DEFAULT_ICON; // 'icon-gift' ante fallos 404 de red[cite: 1]
    }

    const name = this.cleanName();
    if (!name) return REWARD_CONFIG.DEFAULT_ICON;[cite: 1]

    // Si está en tu librería pero vino sin el prefijo 'icon-', se lo anteponemos
    return name.startsWith(REWARD_CONFIG.ICON_PREFIX)
      ? name
      : `${REWARD_CONFIG.ICON_PREFIX}${name}`;
  });

  // URL del CDN con el slug oficial resuelto
  public cdnUrl = computed(() => {
    const raw = this.cleanName();
    const slug = BRAND_ICON_WEB_MAP[raw] ?? raw;
    return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
  });

  public onImageError(): void {
    // Si la web devuelve 404, cae inmediatamente al fallback de tu librería
    this.hasLoadError.set(true);
  }
}



<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  <!-- Componente abstracto que resuelve tanto la web como tu librería interna -->
  <app-reward-icon 
    [iconName]="$reward().icon" 
    [size]="$reward().isVoluntary ? 'md' : 'sm'">
  </app-reward-icon>

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