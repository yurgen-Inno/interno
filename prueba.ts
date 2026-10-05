import { DestroyRef, ElementRef, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ELEMENT_WIDTH_DEFAULTS,
  injectElementWidth,
} from './element-width.util';

const TEST_CONSTANTS = {
  CUSTOM_FALLBACK_WIDTH: 800,
  TARGET_RESIZE_WIDTH: 1024,
  INVALID_WIDTH_ZERO: 0,
  INVALID_WIDTH_NEGATIVE: -50,
} as const;

describe('injectElementWidth Utility', () => {
  let mockElementRef: ElementRef;
  let mockDestroyRef: { onDestroy: jest.Mock };
  let mockResizeObserverInstance: {
    observe: jest.Mock;
    unobserve: jest.Mock;
    disconnect: jest.Mock;
  };
  let resizeCallback: (entries: ResizeObserverEntry[]) => void;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.createElement('div'),
    };

    mockDestroyRef = {
      onDestroy: jest.fn(),
    };

    mockResizeObserverInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    // Mock global de ResizeObserver capturando el callback interno
    global.ResizeObserver = jest.fn().mockImplementation((callback) => {
      resizeCallback = callback;
      return mockResizeObserverInstance;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('debe inicializarse con el valor por defecto de ELEMENT_WIDTH_DEFAULTS', () => {
    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth()
    );

    expect($width()).toBe(ELEMENT_WIDTH_DEFAULTS.FALLBACK_WIDTH);
  });

  it('debe inicializarse con un ancho personalizado cuando se suministra como argumento', () => {
    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH)
    );

    expect($width()).toBe(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH);
  });

  it('debe registrar la observación del elemento nativo del host', () => {
    TestBed.runInInjectionContext(() => injectElementWidth());

    expect(global.ResizeObserver).toHaveBeenCalledTimes(1);
    expect(mockResizeObserverInstance.observe).toHaveBeenCalledWith(
      mockElementRef.nativeElement
    );
  });

  it('debe actualizar el signal cuando ocurre un evento de resize válido', () => {
    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth()
    );

    const mockEntries = [
      {
        contentRect: { width: TEST_CONSTANTS.TARGET_RESIZE_WIDTH },
      } as unknown as ResizeObserverEntry,
    ];

    resizeCallback(mockEntries);

    expect($width()).toBe(TEST_CONSTANTS.TARGET_RESIZE_WIDTH);
  });

  it('no debe actualizar el signal si el ancho recibido es menor o igual a cero', () => {
    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH)
    );

    const mockZeroEntry = [
      {
        contentRect: { width: TEST_CONSTANTS.INVALID_WIDTH_ZERO },
      } as unknown as ResizeObserverEntry,
    ];

    resizeCallback(mockZeroEntry);
    expect($width()).toBe(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH);

    const mockNegativeEntry = [
      {
        contentRect: { width: TEST_CONSTANTS.INVALID_WIDTH_NEGATIVE },
      } as unknown as ResizeObserverEntry,
    ];

    resizeCallback(mockNegativeEntry);
    expect($width()).toBe(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH);
  });

  it('no debe actualizar el signal si la lista de entries llega vacía', () => {
    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH)
    );

    resizeCallback([]);

    expect($width()).toBe(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH);
  });

  it('debe registrar el callback de desconexión en el DestroyRef y llamar a disconnect', () => {
    TestBed.runInInjectionContext(() => injectElementWidth());

    expect(mockDestroyRef.onDestroy).toHaveBeenCalledTimes(1);

    // Ejecuta la función de limpieza que se pasó a destroyRef.onDestroy
    const registeredCleanupCallback = mockDestroyRef.onDestroy.mock.calls[0][0];
    registeredCleanupCallback();

    expect(mockResizeObserverInstance.disconnect).toHaveBeenCalledTimes(1);
  });

  it('debe retornar el fallback de inmediato si ResizeObserver es undefined (entornos SSR)', () => {
    const originalResizeObserver = global.ResizeObserver;
    // @ts-expect-error simulación de entorno sin ResizeObserver
    delete global.ResizeObserver;

    const $width: Signal<number> = TestBed.runInInjectionContext(() =>
      injectElementWidth(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH)
    );

    expect($width()).toBe(TEST_CONSTANTS.CUSTOM_FALLBACK_WIDTH);
    expect(mockDestroyRef.onDestroy).not.toHaveBeenCalled();

    global.ResizeObserver = originalResizeObserver;
  });
});



element-width.util.spec.ts