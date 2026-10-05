<form [formGroup]="filterForm" (ngSubmit)="submitFilters()" class="dashboard-filters">

  <!-- 1. Búsqueda (Izquierda) -->
  <div class="dashboard-filters__field dashboard-filters__field--search">
    <cb-input-search
      [configInputSearch]="{
        'idInput': 'ClientSide',
        'type': 'text',
        'typology': 'outline',
        'disabled': false
      }"
      [items]="[]"
      [placeholder]="'Buscar EVC'"
      [emptyItem]="{ 'title': 'No se encontraron resultados' }"
      [isPredictiveMenuEnabled]="false"
      (selected)="handleSelected($event)"
      [historyItems]="[]"
      [itemTextHistory]="{ 'title': 'Recientes' }"
      [loading]="false"
      [isDefaultPlaceholder]="false"
    />
  </div>

  <!-- 2. Selector (Pilar) -->
  <div class="dashboard-filters__field dashboard-filters__field--select">
    <cb-input-select
      #InputSelectComponent
      [inputSelectFieldConfig]="{
        'idInput': 'products-input-select',
        'label': 'Seleccione un pilar',
        'icon': 'map',
        'helpText': 'Este es un texto de ayuda para el input select',
        'autocomplete': 'off',
        'floatMenuConfig': {
          'items': [
            { 'title': 'pilar 1', 'value': '1' },
            { 'title': 'pilar 2', 'value': '2' }
          ],
          'numberPreloaders': 1
        },
        'blockedCopyPaste': false,
        'disabled': false,
        'placeholder': 'Seleccione una opción',
        'disableOptionValidation': true,
        'typology': 'outline',
        'enabledIconSuccess': false,
        'enabledIconError': false,
        'required': false,
        'enableAgnosticSearch': true,
        'enableFiltering': true,
        'isShowNeutral': true
      }"
      variant="default"
      (valueChanged)="onValueChanged($event)"
      (filterChanged)="filterAccounts($event)"
    >
      <div class="account-option-list">
        @for (account of accountsFilter.visible; track account.title) {
          <button
            class="account-option"
            [class.account-option-selected]="account.title === selection.value"
            type="button"
            (click)="selectAccount(InputSelectComponent, account)"
          >
            <span class="account-option-icon" aria-hidden="true">
              <cb-logo
                class="bc-my-2"
                size="1.5rem"
                [ariaHidden]="false"
                alt="logo"
                name="isotipo-bancolombia"
              />
            </span>
            <span class="account-option-info">
              <span class="account-option-name">{{ account.title }}</span>
              <span class="account-option-detail">{{ account.detailLine1 }}</span>
              <span class="account-option-detail">{{ account.detailLine2 }}</span>
            </span>
            <span class="account-option-amount">{{ account.amount }}</span>
          </button>
        } @empty {
          <p class="account-option-empty">No se encontraron cuentas</p>
        }
      </div>
    </cb-input-select>
  </div>

  <!-- 3. Fechas (Día, Mes, Año) -->
  <div class="dashboard-filters__field dashboard-filters__field--date">
    <cb-input-date
      [inputDateConfig]="{
        'helpText': 'Ej: 01 - enero - 1999',
        'typology': 'outline',
        'disabled': false,
        'enabledIconError': true,
        'enabledIconSuccess': true,
        'showDay': true,
        'showMonth': true,
        'showYear': true,
        'day': {
          'label': 'Día',
          'placeholder': 'DD',
          'disabled': false,
          'icon': 'calendar'
        },
        'month': {
          'label': 'Mes',
          'placeholder': 'MM',
          'icon': 'calendar',
          'disabled': false
        },
        'year': {
          'label': 'Año',
          'placeholder': 'AAAA',
          'disabled': false,
          'icon': 'calendar'
        }
      }"
    />
  </div>

  <!-- 4. Botón Aplicar Filtros (Derecha) -->
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



:host {
  display: block;
  width: 100%;
}

.dashboard-filters {
  display: flex;
  flex-direction: row;
  align-items: flex-end; // Alinea el botón con la parte inferior de los inputs
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;

  &__field {
    display: flex;
    flex-direction: column;

    &--search {
      flex: 1 1 240px;
      min-width: 200px;
    }

    &--select {
      flex: 1 1 260px;
      min-width: 220px;
    }

    &--date {
      flex: 1.5 1 320px;
      min-width: 280px;
    }
  }

  &__actions {
    display: flex;
    align-items: flex-end;
    flex-shrink: 0;
    margin-bottom: 4px; // Ajuste para emparejar con el borde inferior de los inputs
  }
}

// Adaptación fluida para pantallas pequeñas
@media (max-width: 991px) {
  .dashboard-filters {
    flex-wrap: wrap;
    align-items: stretch;

    &__field {
      flex: 1 1 100%;
    }

    &__actions {
      width: 100%;
      justify-content: flex-end;
      margin-bottom: 0;
    }
  }
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { output } from '@angular/core';

// Agrega los componentes de Bancolombia que importas en tu módulo/standalone
// import { CbInputSearch, CbInputSelect, CbInputDate, CbButton, CbIcon, CbLogo } from '@bancolombia/design-system';

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

  public config = {
    helpText: 'Ingresa una fecha válida',
    enabledIconError: true,
    enabledIconSuccess: true,
  };

  // Mock temporal para el listado del selector
  public accountsFilter = { visible: [] };
  public selection = { value: '' };

  public submitFilters(): void {
    this.filterChange.emit(this.filterForm.value as Partial<IDashboardFilters>);
  }

  public onDateChange(date: Date | null): void {
    console.log('Fecha seleccionada:', date);
  }

  public handleSelected(event: unknown): void {
    // Muestra visual
  }

  public onValueChanged(event: unknown): void {
    // Muestra visual
  }

  public filterAccounts(event: unknown): void {
    // Muestra visual
  }

  public selectAccount(component: unknown, account: unknown): void {
    // Muestra visual
  }
}