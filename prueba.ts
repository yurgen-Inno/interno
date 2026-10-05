export const DASHBOARD_FILTERS_CONSTANTS = {
  SEARCH_CONFIG: {
    idInput: 'ClientSide',
    type: 'text',
    typology: 'outline',
    disabled: false,
    placeholder: 'Buscar EVC',
    isPredictiveMenuEnabled: false,
    loading: false,
    isDefaultPlaceholder: false,
  },
  SELECT_CONFIG: {
    idInput: 'products-input-select',
    label: 'Seleccione un pilar',
    icon: 'map',
    placeholder: 'Seleccione una opción',
    typology: 'outline',
    disabled: false,
    items: [
      { title: 'Pilar 1', value: '1' },
      { title: 'Pilar 2', value: '2' },
    ],
  },
  DATE_CONFIG: {
    helpText: 'Ej: 01 - enero - 1999',
    typology: 'outline',
    disabled: false,
    enabledIconError: false,
    enabledIconSuccess: false,
    showDay: true,
    showMonth: true,
    showYear: true,
    day: { label: 'Día', placeholder: 'DD', disabled: false, icon: 'calendar' },
    month: { label: 'Mes', placeholder: 'MM', disabled: false, icon: 'calendar' },
    year: { label: 'Año', placeholder: 'AAAA', disabled: false, icon: 'calendar' },
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
import { DASHBOARD_FILTERS_CONSTANTS } from './dashboard-filters.constants';
import { IDashboardFilters } from '../../models/dashboard.interface'; // Ajusta la ruta a tu modelo

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
})
export class DashboardFiltersComponent {
  public filterChange = output<Partial<IDashboardFilters>>();

  // Configuraciones reactivas
  public readonly $searchConfig = signal(DASHBOARD_FILTERS_CONSTANTS.SEARCH_CONFIG);
  public readonly $selectConfig = signal(DASHBOARD_FILTERS_CONSTANTS.SELECT_CONFIG);
  public readonly $dateConfig = signal(DASHBOARD_FILTERS_CONSTANTS.DATE_CONFIG);
  public readonly $buttonConfig = signal(DASHBOARD_FILTERS_CONSTANTS.BUTTON_CONFIG);

  // Formulario reactivo
  public readonly filterForm = new FormGroup({
    search: new FormControl(''),
    pilar: new FormControl(''),
    date: new FormControl<Date | null>(null),
  });

  // Métodos de muestra (sin efectos secundarios por ahora)
  public onSearchChange(event: unknown): void {}
  public onPilarChange(event: unknown): void {}
  public onDateChange(date: Date | null): void {}
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



:host {
  display: block;
  width: 100%;
}

.filters-bar {
  display: flex;
  flex-direction: row;
  align-items: flex-end; // Alinea los inputs y el botón a ras en la base
  gap: 16px;
  width: 100%;
  padding: 16px 0;

  &__item {
    display: flex;
    flex-direction: column;

    &--search {
      flex: 1.5; // Le da más espacio al campo de búsqueda
      min-width: 200px;
    }

    &--select {
      flex: 1.2;
      min-width: 180px;
    }

    &--date {
      flex: 1.6;
      min-width: 240px;
    }

    &--action {
      flex: 0 0 auto;
      margin-bottom: 2px; // Ajuste milimétrico con el borde inferior de los inputs
    }
  }

  // Comportamiento responsivo en pantallas pequeñas
  @media (max-width: 992px) {
    flex-wrap: wrap;
    align-items: stretch;

    &__item {
      width: 100%;
      flex: 1 1 100%;

      &--action {
        width: 100%;
        margin-top: 8px;

        cb-button {
          width: 100%;
        }
      }
    }
  }
}