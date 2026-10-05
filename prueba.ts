import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importa los componentes UI del design system registrados en tu proyecto
// Asegúrate de importar CbInputSearch, CbInputSelect, CbInputDate, CbButton, CbIcon
// Si usas CbModule o componentes individuales, agrégalos al array 'imports'

export interface IDashboardFilters {
  search: string;
  vicepresidencia: string;
  day: string;
  month: string;
  year: string;
}

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  // ReactiveFormsModule soluciona el error NG8002 de [formGroup]
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
})
export class DashboardFiltersComponent {
  public filterChange = output<Partial<IDashboardFilters>>();

  public filterForm = new FormGroup({
    search: new FormControl(''),
    vicepresidencia: new FormControl('Todas'),
    day: new FormControl('01'),
    month: new FormControl('Enero'),
    year: new FormControl('1999'),
  });

  public dateControl = new FormControl(null, Validators.required);

  // Configuración de búsqueda con tipado literal estricto
  public readonly searchConfig = {
    idInput: 'ClientSide',
    type: 'text' as const,
    typology: 'outline' as const,
    disabled: false,
  };

  // Configuración completa para cb-input-select (sin necesidad de HTML interno)
  public readonly selectPillarConfig = {
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

  // Configuración para el componente de fecha
  public readonly inputDateConfig = {
    helpText: 'Ej: 01 - enero - 1999',
    typology: 'outline',
    disabled: false,
    enabledIconError: true,
    enabledIconSuccess: true,
    showDay: true,
    showMonth: true,
    showYear: true,
    day: {
      label: 'Día',
      placeholder: 'DD',
      disabled: false,
      icon: 'calendar',
    },
    month: {
      label: 'Mes',
      placeholder: 'MM',
      icon: 'calendar',
      disabled: false,
    },
    year: {
      label: 'Año',
      placeholder: 'AAAA',
      disabled: false,
      icon: 'calendar',
    },
  };

  public submitFilters(): void {
    this.filterChange.emit(this.filterForm.value as Partial<IDashboardFilters>);
  }

  public handleSelected(event: unknown): void {}
  public onValueChanged(event: unknown): void {}
  public filterAccounts(event: unknown): void {}
}



<form [formGroup]="filterForm" (ngSubmit)="submitFilters()" class="dashboard-filters">

  <!-- 1. Búsqueda -->
  <div class="dashboard-filters__field dashboard-filters__field--search">
    <cb-input-search
      [configInputSearch]="searchConfig"
      [items]="[]"
      [placeholder]="'Buscar EVC'"
      [emptyItem]="{ title: 'No se encontraron resultados' }"
      [isPredictiveMenuEnabled]="false"
      [historyItems]="[]"
      [itemTextHistory]="{ title: 'Recientes' }"
      [loading]="false"
      [isDefaultPlaceholder]="false"
      (selected)="handleSelected($event)"
    />
  </div>

  <!-- 2. Selector de Pilar (Autosuficiente con floatMenuConfig) -->
  <div class="dashboard-filters__field dashboard-filters__field--select">
    <cb-input-select
      [inputSelectFieldConfig]="selectPillarConfig"
      variant="default"
      (valueChanged)="onValueChanged($event)"
      (filterChanged)="filterAccounts($event)"
    />
  </div>

  <!-- 3. Fechas -->
  <div class="dashboard-filters__field dashboard-filters__field--date">
    <cb-input-date [inputDateConfig]="inputDateConfig" />
  </div>

  <!-- 4. Botón Aplicar Filtros -->
  <div class="dashboard-filters__actions">
    <cb-button
      typeButton="primary"
      sizeButton="default"
      width="hug"
      [disabled]="false"
    >
      <cb-icon fontIcon="filter" />
      Aplicar Filtros
    </cb-button>
  </div>

</form>