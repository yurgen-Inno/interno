import {
  InputSearchFieldConfig,
  InputSelectFieldConfig,
  InputType,
} from '@bancolombia/design-system';

export const SEARCH_CONFIG_DEFAULT: InputSearchFieldConfig = {
  idInput: 'ClientSide',
  type: 'text' as InputType,
  typology: 'outline',
  disabled: false,
  placeholder: 'Buscar EVC',
  items: [],
  emptyItem: { title: 'No se encontraron resultados' },
  isPredictiveMenuEnabled: false,
  historyItems: [],
  itemTextHistory: { title: 'Recientes' },
  loading: false,
  isDefaultPlaceholder: false,
};

export const SELECT_CONFIG_DEFAULT: InputSelectFieldConfig = {
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
};

export const DATE_CONFIG_DEFAULT = {
  helpText: 'Ej: 01 - enero - 1999',
  typology: 'outline',
  disabled: false,
  enabledIconError: true,
  enabledIconSuccess: true,
  showDay: true,
  showMonth: true,
  showYear: true,
};

export const BUTTON_CONFIG_DEFAULT = {
  TEXT: 'Aplicar Filtros',
  ICON: 'filter',
  TYPE: 'primary',
  SIZE: 'default',
  WIDTH: 'hug',
} as const;




import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BcButtonComponent,
  BcIconComponent,
  BcInputDateComponent,
  BcInputSearchComponent,
  BcInputSelectComponent,
  InputSearchFieldConfig,
  InputSelectFieldConfig,
} from '@bancolombia/design-system';

import {
  BUTTON_CONFIG_DEFAULT,
  DATE_CONFIG_DEFAULT,
  SEARCH_CONFIG_DEFAULT,
  SELECT_CONFIG_DEFAULT,
} from './dashboard-filters.constants';
import { IDashboardFilters } from '../../models/dashboard.interface';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Resuelve el error NG8002 de formGroup
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
  public readonly filterChange = output<Partial<IDashboardFilters>>();

  public readonly $searchConfig = signal<InputSearchFieldConfig>(SEARCH_CONFIG_DEFAULT);
  public readonly $selectConfig = signal<InputSelectFieldConfig>(SELECT_CONFIG_DEFAULT);
  public readonly $dateConfig = signal(DATE_CONFIG_DEFAULT);
  public readonly $buttonConfig = signal(BUTTON_CONFIG_DEFAULT);

  public readonly filterForm = new FormGroup({
    search: new FormControl(''),
    pilar: new FormControl(''),
    date: new FormControl<string | Date | null>(null),
  });

  public onSearchChange(event: unknown): void {}
  public onPilarChange(event: unknown): void {}
  public onDateChange(event: unknown): void {}
  public submitFilters(): void {}
}