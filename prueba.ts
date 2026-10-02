import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CardMarketplaceComponent } from './card-marketplace.component';
import { MarketplaceIssuesService } from './services/marketplace-issues.service';
import { IContent } from './interfaces/content.interface';
import { IRewards } from './interfaces/rewards.interface';
import { ICON_SIZES } from './constants/rewards.constants';

describe('CardMarketplaceComponent', () => {
  let component: CardMarketplaceComponent;
  let fixture: ComponentFixture<CardMarketplaceComponent>;
  let mockRewardsMapSignal: ReturnType<typeof signal<Map<string, IRewards>>>;

  const mockContent: IContent = {
    id: 1,
    number: 101,
    title: 'Nueva funcionalidad',
    body: 'Descripción de prueba',
    assigneesCount: 0,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-02',
    htmlUrl: 'https://github.com',
    repositoryName: 'repo-test',
    state: 'open',
    projectName: null,
    url: null,
    labels: ['rw:aws-voucher-1000'],
  };

  beforeEach(async () => {
    mockRewardsMapSignal = signal(new Map<string, IRewards>());

    const mockMarketplaceService = {
      $rewardsMap: mockRewardsMapSignal,
    };

    await TestBed.configureTestingModule({
      imports: [CardMarketplaceComponent, FontAwesomeModule],
      providers: [
        { provide: MarketplaceIssuesService, useValue: mockMarketplaceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMarketplaceComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente e inicializar las constantes de tamaño', () => {
    fixture.componentRef.setInput('$content', mockContent);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.iconSizes).toEqual(ICON_SIZES);
  });

  it('debe renderizar <fa-icon> con clase reward-fa-icon y mostrar el label correcto', () => {
    fixture.componentRef.setInput('$content', {
      ...mockContent,
      labels: ['rw:aws-voucher-1000'],
    });
    fixture.detectChanges();

    const faIconEl = fixture.debugElement.query(By.css('fa-icon.reward-fa-icon'));
    const nvIconEl = fixture.debugElement.query(By.css('nv-icon'));

    expect(faIconEl).toBeTruthy();
    expect(nvIconEl).toBeFalsy();

    // Selector específico para evitar colisión con el label de "Proyecto:"[cite: 13]
    const labelEl = fixture.debugElement.query(
      By.css('div.nv-display-flex span.bc-opensans-font-style-2-semibold')
    );
    expect(labelEl.nativeElement.textContent.trim()).toBe('aws voucher 1000');
  });

  it('debe renderizar <nv-icon> con tamaño VOLUNTARY cuando no tenga etiqueta de recompensa', () => {
    fixture.componentRef.setInput('$content', {
      ...mockContent,
      labels: ['bug', 'enhancement'],
    });
    fixture.detectChanges();

    const faIconEl = fixture.debugElement.query(By.css('fa-icon'));
    const nvIconEl = fixture.debugElement.query(By.css('nv-icon'));

    expect(faIconEl).toBeFalsy();
    expect(nvIconEl).toBeTruthy();
    expect(nvIconEl.attributes['size'] || nvIconEl.properties['size']).toBe(ICON_SIZES.VOLUNTARY);

    const voluntarySpan = fixture.debugElement.query(
      By.css('span.bc-opensans-font-style-2-regular')
    );
    expect(voluntarySpan).toBeTruthy();
    expect(voluntarySpan.nativeElement.textContent).toContain('(contribución voluntaria)');
  });
});



import { IRewards } from '@core/models/marketplace-issues.model';
import { AdapterMarketplaceIssuesService } from './adapter-marketplace-issues.service';
import {
  REWARD_CONFIG,
  BRAND_FA_ICONS,
} from '@core/constants/marketplace-issues.constant';

describe('MarketplaceRewardAdapter', () => {
  let mockCatalog: Map<string, IRewards>;

  beforeEach(() => {
    mockCatalog = new Map<string, IRewards>([
      [
        'aws-voucher',
        {
          rewardName: 'aws-voucher',
          description: 'Bono AWS',
          icon: 'icon-cloud',
        },
      ],
      [
        'github-voucher',
        {
          rewardName: 'github-voucher',
          description: 'Bono Github',
          icon: 'cat',
        },
      ],
      [
        'other-benefit',
        {
          rewardName: 'other-benefit',
          description: 'Beneficio interno',
          icon: 'icon-star',
        },
      ],
    ]);
  });

  describe('extractRewardKey', () => {
    it('debe extraer la etiqueta que inicia con el prefijo configurado', () => {
      const labels = ['bug', 'frontend', 'rw:aws-voucher-3000'];
      const result = AdapterMarketplaceIssuesService.extractRewardKey(labels);
      expect(result).toBe('rw:aws-voucher-3000');
    });

    it('debe retornar string vacío si labels es undefined o no es un arreglo', () => {
      expect(AdapterMarketplaceIssuesService.extractRewardKey(undefined)).toBe('');
      expect(AdapterMarketplaceIssuesService.extractRewardKey([] as any)).toBe('');
    });

    it('debe retornar string vacío si ninguna etiqueta coincide', () => {
      const labels = ['bug', 'enhancement'];
      expect(AdapterMarketplaceIssuesService.extractRewardKey(labels)).toBe('');
    });
  });

  describe('normalizeMatchKey', () => {
    it('debe remover el prefijo rw:, ignorar montos numéricos y ordenar alfabéticamente', () => {
      const raw = 'rw:aws-voucher-3000';
      const result = AdapterMarketplaceIssuesService.normalizeMatchKey(raw);
      expect(result).toBe('aws-voucher');
    });

    it('debe tolerar orden inverso generando la misma clave canónica', () => {
      const keyDirect = AdapterMarketplaceIssuesService.normalizeMatchKey('rw:aws-voucher');
      const keyReverse = AdapterMarketplaceIssuesService.normalizeMatchKey('rw:voucher-aws');
      expect(keyDirect).toBe('aws-voucher');
      expect(keyReverse).toBe('aws-voucher');
      expect(keyDirect).toEqual(keyReverse);
    });

    it('debe retornar string vacío si la entrada es nula o inválida', () => {
      expect(AdapterMarketplaceIssuesService.normalizeMatchKey(null)).toBe('');
      expect(AdapterMarketplaceIssuesService.normalizeMatchKey(undefined)).toBe('');
      expect(AdapterMarketplaceIssuesService.normalizeMatchKey('')).toBe('');
    });
  });

  describe('formatLabel', () => {
    it('debe formatear correctamente la etiqueta conservando identificadores y montos', () => {
      const result = AdapterMarketplaceIssuesService.formatLabel('rw:aws-voucher-3000');
      expect(result).toBe('aws voucher 3000');
    });

    it('debe retornar VOLUNTARY_LABEL si el texto es "no definido" o está vacío', () => {
      expect(AdapterMarketplaceIssuesService.formatLabel('no definido')).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
      expect(AdapterMarketplaceIssuesService.formatLabel('')).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
      expect(AdapterMarketplaceIssuesService.formatLabel(undefined)).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
    });
  });

  describe('toViewModel', () => {
    it('debe retornar el estado voluntario con nvIcon si no existen etiquetas de recompensa', () => {
      const result = AdapterMarketplaceIssuesService.toViewModel(['ui', 'fix'], mockCatalog);

      expect(result).toEqual({
        label: REWARD_CONFIG.VOLUNTARY_LABEL,
        isVoluntary: true,
        nvIcon: REWARD_CONFIG.VOLUNTARY_ICON,
      });
    });

    it('debe resolver faIcon cuando coincide la clave normalizada de una marca (aws)', () => {
      const labels = ['rw:aws-voucher-5000'];
      const result = AdapterMarketplaceIssuesService.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        label: 'aws voucher 5000',
        isVoluntary: false,
        faIcon: BRAND_FA_ICONS['aws'],
      });
    });

    it('debe resolver faIcon incluso si los tokens vienen invertidos (voucher-aws)', () => {
      const labels = ['rw:voucher-aws-3000'];
      const result = AdapterMarketplaceIssuesService.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        label: 'voucher aws 3000',
        isVoluntary: false,
        faIcon: BRAND_FA_ICONS['aws'],
      });
    });

    it('debe resolver faIcon a través de alias (ej. amazon)', () => {
      const labels = ['rw:amazon-voucher-2000'];
      const result = AdapterMarketplaceIssuesService.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        label: 'amazon voucher 2000',
        isVoluntary: false,
        faIcon: BRAND_FA_ICONS['aws'],
      });
    });

    it('debe retornar nvIcon si la recompensa existe en el catálogo pero NO es de FontAwesome', () => {
      const labels = ['rw:other-benefit'];
      const result = AdapterMarketplaceIssuesService.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        label: 'other benefit',
        isVoluntary: false,
        nvIcon: 'icon-star',
      });
    });

    it('debe usar el prefijo limpio para nvIcon si la recompensa no existe en catálogo ni FontAwesome', () => {
      const labels = ['rw:unknown-reward-100'];
      const result = AdapterMarketplaceIssuesService.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        label: 'unknown reward 100',
        isVoluntary: false,
        nvIcon: `${REWARD_CONFIG.ICON_PREFIX}reward-unknown`,
      });
    });
  });
});