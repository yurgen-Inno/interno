import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importa aquí los componentes de la librería de UI si son Standalone
// (por ejemplo: CbInputSearch, CbInputSelect, CbInputDate, CbButton, CbIcon)

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // CbInputSearch, CbInputSelect, CbInputDate, CbButton, CbIcon // <- Descomenta e importa según tu librería
  ],
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

  // 1. Tipado estricto con 'as const' para que no infiera 'string'
  public readonly searchConfig = {
    idInput: 'ClientSide',
    type: 'text' as const,
    typology: 'outline' as const,
    disabled: false,
  };

  // 2. Tipado estricto con 'as const' al final del objeto
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
    typology: 'outline' as const, // Requiere literal 'outline'
    enabledIconSuccess: false,
    enabledIconError: false,
    required: false,
    enableAgnosticSearch: true,
    enableFiltering: true,
    isShowNeutral: true,
  };

  // 3. Tipado estricto con 'as const'
  public readonly inputDateConfig = {
    helpText: 'Ej: 01 - enero - 1999',
    typology: 'outline' as const, // Requiere literal 'outline'
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