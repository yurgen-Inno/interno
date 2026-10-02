import { MarketplaceRewardAdapter } from './marketplace-reward.adapter';
import { REWARD_CONFIG } from './marketplace-rewards.constant';
import { IRewards } from './rewards.interface'; //[cite: 5]

describe('MarketplaceRewardAdapter', () => {
  let mockCatalog: Map<string, IRewards>;

  beforeEach(() => {
    mockCatalog = new Map<string, IRewards>([
      [
        'aws-voucher',
        {
          rewardName: 'aws-voucher',
          description: 'Bono AWS',
          icon: 'icon-cloud', //[cite: 1, 5]
        },
      ],
      [
        'github-voucher',
        {
          rewardName: 'github-voucher',
          description: 'Bono Github',
          icon: 'cat', // Sin prefijo 'icon-' para probar resolveIconName
        },
      ],
    ]);
  });

  describe('extractRewardKey', () => {
    it('debe extraer la etiqueta que inicia con el prefijo configurado', () => {
      const labels = ['bug', 'frontend', 'rw:aws-voucher-3000'];
      const result = MarketplaceRewardAdapter.extractRewardKey(labels);
      expect(result).toBe('rw:aws-voucher-3000');
    });

    it('debe retornar string vacío si labels es undefined o no es un arreglo', () => {
      expect(MarketplaceRewardAdapter.extractRewardKey(undefined)).toBe('');
      expect(MarketplaceRewardAdapter.extractRewardKey([] as any)).toBe('');
    });

    it('debe retornar string vacío si ninguna etiqueta coincide', () => {
      const labels = ['bug', 'enhancement'];
      expect(MarketplaceRewardAdapter.extractRewardKey(labels)).toBe('');
    });
  });

  describe('normalizeMatchKey', () => {
    it('debe remover el prefijo rw:, ignorar montos numéricos y ordenar alfabéticamente', () => {
      const raw = 'rw:aws-voucher-3000';
      const result = MarketplaceRewardAdapter.normalizeMatchKey(raw);
      expect(result).toBe('aws-voucher');
    });

    it('debe tolerar orden inverso generando la misma clave canónica', () => {
      const keyDirect = MarketplaceRewardAdapter.normalizeMatchKey('rw:aws-voucher');
      const keyReverse = MarketplaceRewardAdapter.normalizeMatchKey('rw:voucher-aws');
      expect(keyDirect).toBe('aws-voucher');
      expect(keyReverse).toBe('aws-voucher');
      expect(keyDirect).toEqual(keyReverse);
    });

    it('debe retornar string vacío si la entrada es nula o inválida', () => {
      expect(MarketplaceRewardAdapter.normalizeMatchKey(null)).toBe('');
      expect(MarketplaceRewardAdapter.normalizeMatchKey(undefined)).toBe('');
      expect(MarketplaceRewardAdapter.normalizeMatchKey('')).toBe('');
    });
  });

  describe('formatLabel', () => {
    it('debe formatear correctamente la etiqueta conservando identificadores y montos', () => {
      const result = MarketplaceRewardAdapter.formatLabel('rw:aws-voucher-3000');
      expect(result).toBe('aws voucher 3000');
    });

    it('debe retornar VOLUNTARY_LABEL si el texto es "no definido" o está vacío', () => {
      expect(MarketplaceRewardAdapter.formatLabel('no definido')).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
      expect(MarketplaceRewardAdapter.formatLabel('')).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
      expect(MarketplaceRewardAdapter.formatLabel(undefined)).toBe(
        REWARD_CONFIG.VOLUNTARY_LABEL
      );
    });
  });

  describe('toViewModel', () => {
    it('debe retornar el estado voluntario si no existen etiquetas de recompensa', () => {
      const result = MarketplaceRewardAdapter.toViewModel(['ui', 'fix'], mockCatalog);

      expect(result).toEqual({
        icon: REWARD_CONFIG.VOLUNTARY_ICON,
        label: REWARD_CONFIG.VOLUNTARY_LABEL,
        isVoluntary: true,
      });
    });

    it('debe resolver la recompensa exacta cuando coincide la clave normalizada', () => {
      const labels = ['rw:aws-voucher-5000'];
      const result = MarketplaceRewardAdapter.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        icon: 'icon-cloud',
        label: 'aws voucher 5000',
        isVoluntary: false,
      });
    });

    it('debe resolver la recompensa incluso si los tokens vienen invertidos', () => {
      const labels = ['rw:voucher-aws-3000'];
      const result = MarketplaceRewardAdapter.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        icon: 'icon-cloud',
        label: 'voucher aws 3000',
        isVoluntary: false,
      });
    });

    it('debe anteponer el prefijo "icon-" si el ícono del backend no lo incluye', () => {
      const labels = ['rw:github-voucher'];
      const result = MarketplaceRewardAdapter.toViewModel(labels, mockCatalog);

      expect(result.icon).toBe('icon-cat');
    });

    it('debe usar DEFAULT_ICON si la recompensa no existe en el catálogo', () => {
      const labels = ['rw:unknown-reward-100'];
      const result = MarketplaceRewardAdapter.toViewModel(labels, mockCatalog);

      expect(result).toEqual({
        icon: REWARD_CONFIG.DEFAULT_ICON,
        label: 'unknown reward 100',
        isVoluntary: false,
      });
    });
  });
});


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CardMarketplaceComponent } from './card-marketplace.component';
import { MarketplaceIssuesService } from './marketplace-issues.service';
import { IRewards } from './rewards.interface'; //[cite: 5]
import { IContent } from './content.interface'; //[cite: 7]

describe('CardMarketplaceComponent', () => {
  let component: CardMarketplaceComponent;
  let fixture: ComponentFixture<CardMarketplaceComponent>;
  const mockRewardsMapSignal = signal<Map<string, IRewards>>(new Map());

  const mockService = {
    $rewardsMap: mockRewardsMapSignal,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMarketplaceComponent],
      providers: [
        { provide: MarketplaceIssuesService, useValue: mockService },
      ],
    }).compileComponents();

    mockRewardsMapSignal.set(
      new Map([
        [
          'aws-voucher',
          { rewardName: 'aws-voucher', description: 'AWS', icon: 'icon-cloud' }, //[cite: 1, 5]
        ],
      ])
    );

    fixture = TestBed.createComponent(CardMarketplaceComponent);
    component = fixture.componentInstance;
  });

  it('debe inicializar y computar la recompensa para una tarjeta con voucher', () => {
    const mockContent: IContent = {
      labels: ['rw:aws-voucher-3000'],
    } as unknown as IContent;

    fixture.componentRef.setInput('$content', mockContent);
    fixture.detectChanges();

    const reward = component.$reward();
    expect(reward.isVoluntary).toBe(false);
    expect(reward.icon).toBe('icon-cloud');
    expect(reward.label).toBe('aws voucher 3000');
  });

  it('debe computar como voluntario si no contiene etiqueta rw:', () => {
    const mockContent: IContent = {
      labels: ['documentation'],
    } as unknown as IContent;

    fixture.componentRef.setInput('$content', mockContent);
    fixture.detectChanges();

    const reward = component.$reward();
    expect(reward.isVoluntary).toBe(true);
    expect(reward.icon).toBe('icon-hand-handshake'); //[cite: 2]
    expect(reward.label).toBe('Sin recompensa'); //[cite: 2]
  });
});



describe('Rewards Catalog & $rewardsMap', () => {
  const mockApiRewards: IRewards[] = [
    { rewardName: 'aws-voucher', description: 'AWS', icon: 'icon-cloud' },
    { rewardName: 'github-voucher', description: 'Github', icon: 'icon-cat' }
  ];
  const catalogUrl = `${environment.apiBaseUrl}catalog/api/v1/rewards`;

  it('debe consultar getRewards() y emitir el arreglo de recompensas', (done) => {
    // Si tu servicio tiene toSignal, este ya disparó la primera petición
    httpMock.expectOne(catalogUrl).flush([]);

    service.getRewards().subscribe((rewards) => {
      expect(rewards).toEqual(mockApiRewards);
      done();
    });

    const req = httpMock.expectOne(catalogUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiRewards);
  });

  it('debe poblar $rewardsMap indexado por clave normalizada tras resolver el endpoint', () => {
    // Responde a la petición inicial disparada por toSignal al instanciar el servicio
    const req = httpMock.expectOne(catalogUrl);
    req.flush(mockApiRewards);

    const map = service.$rewardsMap();
    expect(map.size).toBe(2);
    expect(map.get('aws-voucher')?.icon).toBe('icon-cloud');
    expect(map.get('github-voucher')?.icon).toBe('icon-cat');
  });

  it('debe manejar error HTTP en el catálogo y dejar $rewardsMap como Map vacío', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const req = httpMock.expectOne(catalogUrl);
    req.error(new ProgressEvent('Network error'), { status: 500, statusText: 'Error' });

    expect(service.$rewardsMap().size).toBe(0);
  });
});