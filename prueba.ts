export const DASHBOARD_FILTERS_CONSTANTS = {
  SEARCH_CONFIG: {
    idInput: 'ClientSide',
    type: 'text' as const,
    typology: 'outline' as const,
    disabled: false,
    placeholder: 'Buscar EVC',
    items: [],
    emptyItem: { title: 'No se encontraron resultados' },
    isPredictiveMenuEnabled: false,
    historyItems: [],
    itemTextHistory: { title: 'Recientes' },
    loading: false,
    isDefaultPlaceholder: false,
  },
  SELECT_CONFIG: {
    idInput: 'products-input-select',
    label: 'Seleccione un pilar',
    icon: 'map',
    helpText: 'Este es un texto de ayuda para el input select',
    autocomplete: 'off',
    floatMenuConfig: {
      items: [
        { title: 'Pilar 1', value: '1' },
        { title: 'Pilar 2', value: '2' },
      ],
      numberPreloaders: 1,
    },
    blockedCopyPaste: false,
    disabled: false,
    placeholder: 'Seleccione una opción',
    disableOptionValidation: true,
    typology: 'outline',
    enabledIconSuccess: false,
    enabledIconError: false,
    required: false,
    enableAgnosticSearch: true,
    enableFiltering: true,
    isShowNeutral: true,
  },
  DATE_CONFIG: {
    helpText: 'Ej: 01 - enero - 1999',
    typology: 'outline',
    disabled: false,
    enabledIconError: true,
    enabledIconSuccess: true,
    showDay: true,
    showMonth: true,
    showYear: true,
  },
  BUTTON_CONFIG: {
    TEXT: 'Aplicar Filtros',
    ICON: 'filter',
    TYPE: 'primary',
    SIZE: 'default',
    WIDTH: 'hug',
  },
} as const;



import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Componentes del Design System de Bancolombia
import {
  BcButtonComponent,
  BcIconComponent,
  BcInputDateComponent,
  BcInputSearchComponent,
  BcInputSelectComponent,
} from '@bancolombia/design-system';

import { DASHBOARD_FILTERS_CONSTANTS } from './dashboard-filters.constants';
import { IDashboardFilters } from '../../models/dashboard.interface';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Resuelve el error NG8002 de [formGroup]
    BcInputSearchComponent,
    BcInputSelectComponent,
    BcInputDateComponent,
    BcButtonComponent,
    BcIconComponent,
  ],
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
})
export class DashboardFiltersComponent {
  public filterChange = output<Partial<IDashboardFilters>>();

  public readonly $searchConfig = signal(DASHBOARD_FILTERS_CONSTANTS.SEARCH_CONFIG);
  public readonly $selectConfig = signal(DASHBOARD_FILTERS_CONSTANTS.SELECT_CONFIG);
  public readonly $dateConfig = signal(DASHBOARD_FILTERS_CONSTANTS.DATE_CONFIG);
  public readonly $buttonConfig = signal(DASHBOARD_FILTERS_CONSTANTS.BUTTON_CONFIG);

  public readonly filterForm = new FormGroup({
    search: new FormControl(''),
    pilar: new FormControl(''),
    date: new FormControl<string | Date | null>(null),
  });

  public onSearchChange(event: unknown): void {}

  public onPilarChange(event: unknown): void {}

  // Resuelve TS2345 recibiendo el evento genérico emitido por el componente
  public onDateChange(event: unknown): void {}

  public submitFilters(): void {}
}


<form [formGroup]="filterForm" class="filters-bar" (ngSubmit)="submitFilters()">
  <!-- 1. Búsqueda -->
  <div class="filters-bar__item filters-bar__item--search">
    <cb-input-search
      [configInputSearch]="$searchConfig()"
      [placeholder]="$searchConfig().placeholder"
      (selected)="onSearchChange($event)"
    />
  </div>

  <!-- 2. Selector de Pilar -->
  <div class="filters-bar__item filters-bar__item--select">
    <cb-input-select
      [inputSelectFieldConfig]="$selectConfig()"
      variant="default"
      (valueChanged)="onPilarChange($event)"
    />
  </div>

  <!-- 3. Selector de Fechas -->
  <div class="filters-bar__item filters-bar__item--date">
    <cb-input-date
      [inputDateConfig]="$dateConfig()"
      (dateChange)="onDateChange($event)"
    />
  </div>

  <!-- 4. Botón Aplicar -->
  <div class="filters-bar__item filters-bar__item--action">
    <cb-button
      [typeButton]="$buttonConfig().TYPE"
      [sizeButton]="$buttonConfig().SIZE"
      [width]="$buttonConfig().WIDTH"
      [disabled]="false"
      (click)="submitFilters()"
    >
      <cb-icon [fontIcon]="$buttonConfig().ICON" />
      {{ $buttonConfig().TEXT }}
    </cb-button>
  </div>
</form>