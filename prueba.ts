.bottom-card-container {
  position: relative;
  display: block;
  width: 100%;

  cb-card-content {
    display: block;
    width: 100%;
  }

  .thresholds-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    z-index: 2;

    /* En pantallas de escritorio / pantallas grandes: flotan dentro de la tarjeta */
    @media (min-width: 992px) {
      position: absolute;
      left: 64px;
      bottom: 14px;
      padding-right: 24px;
      pointer-events: none;
    }

    /* En tablets y móviles (cuando el texto ocupa más líneas o no cabe en una fila) */
    @media (max-width: 991px) {
      position: static;
      margin-top: 10px;
      padding-left: 16px;
      padding-bottom: 8px;
    }

    .threshold-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;

      &.badge-success {
        background-color: #e8f5e9;
        color: #1b5e20;
        border: 1px solid #c8e6c9;
      }

      &.badge-warning {
        background-color: #fff9c4;
        color: #827717;
        border: 1px solid #fff59d;
      }

      &.badge-danger {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ffcdd2;
      }

      &.badge-neutral {
        background-color: #f5f5f5;
        color: #616161;
        border: 1px solid #e0e0e0;
      }
    }
  }
}



import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Ajusta las rutas según tu estructura de carpetas
import { TABS_MENU_TECHD } from './dashboards-principal.constants'; 

export type DashboardTabId = 'summary' | 'pillars' | 'ranking' | 'evolution';

export interface DashboardTabItem {
  id: string;
  title: string;
  icon: string;
  disabled: boolean;
  iconRight: boolean;
  hasBadge: boolean;
}

// ... imports de componentes hijos y decorador @Component

export class DashboardsPrincipalComponent {
  // ... resto de tus inyecciones y servicios

  // 1. Signal reactivo para la lista de pestañas
  public readonly $tabs = signal<DashboardTabItem[]>(TABS_MENU_TECHD);

  // 2. Signal para la pestaña activa inicial (por defecto 'summary')
  public readonly $activeTabId = signal<string>(TABS_MENU_TECHD[0]?.id ?? 'summary');

  // ... filtros, rxResource y computed ($overviewData, $tableData)

  // 3. Manejador del cambio de tab
  public onTabSelected(event: DashboardTabItem | { id: string } | string): void {
    const selectedId = typeof event === 'string' ? event : event?.id;
    if (!selectedId) {
      return;
    }

    this.$activeTabId.set(selectedId);

    // Preparado para futura navegación o cambio de vista:
    // if (selectedId === 'pillars') { ... }
  }

  // ... onApplyFilters, onChangePage
}



<section class="bc-container bc-mt-5">
  <div class="bc-mt-5">
    <app-dashboard-summary-card [headerData]="$overviewData()?.header" />
  </div>

  <!-- Tabs del sistema de diseño -->
  <cb-tabs
    [tabs]="$tabs()"
    [activeTabId]="$activeTabId()"
    (tabSelected)="onTabSelected($event)">
  </cb-tabs>

  <!-- Contenido actual (Resumen) -->
  <ng-container *ngIf="$activeTabId() === 'summary'">
    <app-dashboards-cards
      [cards]="$overviewData()?.kpiCards ?? []"
      [thresholds]="$overviewData()?.scoreThresholds"
    />

    <app-dashboard-bars [data]="$overviewData()?.pillarComparison" />

    <app-dashboards-table
      [tableData]="$tableData()"
      (pageChange)="onChangePage($event)"
    />
  </ng-container>

  <!-- Espacio preparado para cuando implementes las siguientes pestañas -->
  <div *ngIf="$activeTabId() !== 'summary'" class="tab-placeholder bc-mt-4">
    <p>Sección en desarrollo: {{ $activeTabId() }}</p>
  </div>
</section>