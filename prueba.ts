import { DestroyRef, ElementRef, inject, signal, Signal } from '@angular/core';

const RESIZE_DEFAULTS = {
  FALLBACK_WIDTH: 1200,
  MIN_VALID_WIDTH: 0,
} as const;

/**
 * Hook utilitario que retorna un Signal reactivo con el ancho en px del elemento host.
 * Se encarga automáticamente de iniciar el ResizeObserver y de destruirlo al destruirse el componente.
 */
export function injectElementWidth(defaultWidth: number = RESIZE_DEFAULTS.FALLBACK_WIDTH): Signal<number> {
  const elementRef = inject(ElementRef);
  const destroyRef = inject(DestroyRef);
  const $width = signal<number>(defaultWidth);

  // Early return si se ejecuta en SSR o entornos sin ResizeObserver
  if (typeof ResizeObserver === 'undefined') {
    return $width.asReadonly();
  }

  const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const primaryEntry = entries[0];
    if (!primaryEntry) {
      return;
    }

    const calculatedWidth = Math.floor(primaryEntry.contentRect.width);
    if (calculatedWidth <= RESIZE_DEFAULTS.MIN_VALID_WIDTH) {
      return;
    }

    $width.set(calculatedWidth);
  });

  resizeObserver.observe(elementRef.nativeElement);

  // Desconexión automática sin necesidad de implementar ngOnDestroy en cada componente
  destroyRef.onDestroy(() => {
    resizeObserver.disconnect();
  });

  return $width.asReadonly();
}