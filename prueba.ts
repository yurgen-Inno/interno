// card-marketplace.constants.ts
export const REWARD_CONFIG = {
  DEFAULT_ICON: 'icon-gift',
  VOLUNTARY_ICON: 'icon-hand-handshake',
  VOLUNTARY_LABEL: 'Sin recompensa',
  ICON_PREFIX: 'icon-',
  EMPTY_SIZE: 0,
} as const;




// card-marketplace.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContent } from './content.interface';
import { REWARD_CONFIG } from './card-marketplace.constants';
import { 
  extractRewardFromLabels, 
  getRewardMatchKey, 
  formatRewardLabel 
} from './marketplace-reward.utils';
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { IRewards } from './rewards.interface';

export type StatusType = 'only';
export type StatusBorder = 'center';
export type StatusRadius = 'radius-16';

@Component({
  selector: 'app-card-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-marketplace.component.html',
  styleUrls: ['./card-marketplace.component.scss']
})
export class CardMarketplaceComponent {
  private readonly _issuesService = inject(MarketplaceIssuesService);

  public type: StatusType = 'only';
  public border: StatusBorder = 'center';
  public radius: StatusRadius = 'radius-16';
  public $content = input.required<IContent>();

  public readonly $reward = computed(() => {
    const rawReward = extractRewardFromLabels(this.$content()?.labels);

    if (!rawReward) {
      return {
        icon: REWARD_CONFIG.VOLUNTARY_ICON,
        label: REWARD_CONFIG.VOLUNTARY_LABEL,
        isVoluntary: true,
      };
    }

    const catalog = this._issuesService.rewardsMap();
    const matchKey = getRewardMatchKey(rawReward);
    const rewardInfo = catalog.get(matchKey) ?? this._findRewardByTokens(catalog, matchKey);
    const resolvedIcon = this._resolveIconName(rewardInfo?.icon);

    return {
      icon: resolvedIcon,
      label: formatRewardLabel(rawReward),
      isVoluntary: false,
    };
  });

  private _resolveIconName(iconName?: string): string {
    const rawIcon = iconName ?? REWARD_CONFIG.DEFAULT_ICON;
    return rawIcon.startsWith(REWARD_CONFIG.ICON_PREFIX)
      ? rawIcon
      : `${REWARD_CONFIG.ICON_PREFIX}${rawIcon}`;
  }

  private _findRewardByTokens(catalog: Map<string, IRewards>, matchKey: string): IRewards | undefined {
    if (catalog.size === REWARD_CONFIG.EMPTY_SIZE) {
      return undefined;
    }

    for (const [key, item] of catalog.entries()) {
      const tokens = key.split('-');
      const isMatch = tokens.every(token => matchKey.includes(token));
      if (isMatch) {
        return item;
      }
    }

    return undefined;
  }
}






// card-marketplace.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef, signal } from '@angular/core';
import { CardMarketplaceComponent } from './card-marketplace.component';
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { REWARD_CONFIG } from './card-marketplace.constants';
import { IRewards } from './rewards.interface';
import { IContent } from './content.interface';

describe('CardMarketplaceComponent', () => {
  let component: CardMarketplaceComponent;
  let componentRef: ComponentRef<CardMarketplaceComponent>;
  let fixture: ComponentFixture<CardMarketplaceComponent>;

  // Signal mockeado para el servicio
  const rewardsMapMock = signal<Map<string, IRewards>>(new Map());

  const mockService = {
    rewardsMap: rewardsMapMock,
  };

  const createMockContent = (labels?: string[]): IContent => ({
    id: 101,
    title: 'Test issue title',
    labels: labels ?? [],
  } as unknown as IContent);

  beforeEach(async () => {
    rewardsMapMock.set(new Map());

    await TestBed.configureTestingModule({
      imports: [CardMarketplaceComponent],
      providers: [
        { provide: MarketplaceIssuesService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMarketplaceComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('debe crearse correctamente con sus valores por defecto', () => {
    componentRef.setInput('$content', createMockContent());
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.type).toBe('only');
    expect(component.border).toBe('center');
    expect(component.radius).toBe('radius-16');
  });

  describe('Cálculo de $reward', () => {
    it('debe retornar estado voluntario cuando no hay labels', () => {
      componentRef.setInput('$content', createMockContent([]));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(true);
      expect(result.icon).toBe(REWARD_CONFIG.VOLUNTARY_ICON);
      expect(result.label).toBe(REWARD_CONFIG.VOLUNTARY_LABEL);
    });

    it('debe retornar estado voluntario cuando labels no contiene ninguno con prefijo rw:', () => {
      componentRef.setInput('$content', createMockContent(['bug', 'feature']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(true);
      expect(result.icon).toBe(REWARD_CONFIG.VOLUNTARY_ICON);
    });

    it('debe resolver la recompensa exacta desde el catálogo y formatear la etiqueta', () => {
      const catalog = new Map<string, IRewards>();
      catalog.set('aws-voucher', {
        rewardName: 'aws-voucher',
        icon: 'icon-cloud',
        description: 'AWS Voucher',
      });
      rewardsMapMock.set(catalog);

      componentRef.setInput('$content', createMockContent(['rw:aws-voucher']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(false);
      expect(result.icon).toBe('icon-cloud');
      expect(result.label).toBe('aws voucher');
    });

    it('debe resolver el icono correctamente aun cuando los tokens vengan permutados', () => {
      const catalog = new Map<string, IRewards>();
      catalog.set('aws-voucher', {
        rewardName: 'aws-voucher',
        icon: 'icon-cloud',
        description: 'AWS Voucher',
      });
      rewardsMapMock.set(catalog);

      componentRef.setInput('$content', createMockContent(['rw:voucher-aws']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(false);
      expect(result.icon).toBe('icon-cloud');
    });

    it('debe resolver por tokens parciales si incluye sufijos como -copilot', () => {
      const catalog = new Map<string, IRewards>();
      catalog.set('github-voucher', {
        rewardName: 'github-voucher',
        icon: 'icon-cat',
        description: 'GitHub Copilot',
      });
      rewardsMapMock.set(catalog);

      componentRef.setInput('$content', createMockContent(['rw:github-voucher-copilot']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(false);
      expect(result.icon).toBe('icon-cat');
      expect(result.label).toBe('github voucher copilot');
    });

    it('debe anteponer el prefijo icon- si el backend devuelve un icono sin prefijo', () => {
      const catalog = new Map<string, IRewards>();
      catalog.set('azure-voucher', {
        rewardName: 'azure-voucher',
        icon: 'muverang',
        description: 'Azure',
      });
      rewardsMapMock.set(catalog);

      componentRef.setInput('$content', createMockContent(['rw:azure-voucher']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.icon).toBe('icon-muverang');
    });

    it('debe aplicar DEFAULT_ICON si la recompensa no existe en el catálogo', () => {
      rewardsMapMock.set(new Map());

      componentRef.setInput('$content', createMockContent(['rw:desconocido-voucher']));
      fixture.detectChanges();

      const result = component.$reward();

      expect(result.isVoluntary).toBe(false);
      expect(result.icon).toBe(REWARD_CONFIG.DEFAULT_ICON);
      expect(result.label).toBe('desconocido voucher');
    });
  });
});