:host {
  display: block;
  width: 100%;
}

.summary-card-wrapper {
  display: block;
  width: 100%;
  margin-bottom: 16px;

  cb-card-content {
    display: block !important;
    width: 100% !important;

    // Variables internas que usa la librería para calcular el ancho
    --bc-card-width: 100% !important;
    --bc-card-max-width: 100% !important;
    --card-width: 100% !important;
    --width: 100% !important;
  }
}


import { Component, computed, ElementRef, inject, input, signal, OnInit, OnDestroy } from '@angular/core';

export class DashboardSummaryCardComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  
  // Guardamos el ancho real en píxeles del contenedor
  public containerWidth = signal<number>(1200);
  private resizeObserver?: ResizeObserver;

  public headerData = input<any>();

  ngOnInit(): void {
    // Escucha el tamaño real del contenedor en el navegador
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = Math.floor(entry.contentRect.width);
          if (width > 0) {
            this.containerWidth.set(width);
          }
        }
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  public cardConfiguration = computed(() => {
    const data = this.headerData();
    const title = data?.title ?? 'Tech Mindfulness Organizacional';
    const subtitle = data?.subtitle ?? '';
    const cutoffDate = data?.cutoffDate ?? '';
    const lastUpdated = data?.lastUpdated ?? 'Actualizado';

    return {
      idCard: 'summary-main-card',
      isActionable: false,
      // Asigna dinámicamente los píxeles reales del ancho de la pantalla:
      widthCardContent: this.containerWidth(),
      cardPosition: 'horizontal',
      cardSize: 'small',
      cardType: 'card-icon',
      iconFloat: 'icon-book-2',
      configurationIcon: {
        icon: 'icon-book-2',
      },
      status: {
        color: 'status-neutral-3',
        text: lastUpdated,
        type: 'icon-left',
        customIcon: 'icon-investment',
        border: 'right'
      },
      title: {
        value: title,
        typographyClass: ''
      },
      subtitle: {
        value: subtitle,
        typographyClass: ''
      },
      textDescription: {
        value: `${subtitle} Corte al ${cutoffDate}`.trim(),
        typographyClass: ''
      },
      additionalInfo: [],
    } as any;
  });
}