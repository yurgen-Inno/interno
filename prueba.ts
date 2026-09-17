import { Component, input, output } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IEventSelectDocument,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';

interface IDropdownOptionEvent {
  optionSeleted?: string;
  optionSelected?: string;
  id?: string;
  value?: string;
}

@Component({
  selector: 'app-list-all-documents',
  standalone: true,
  imports: [BcTableModule, BcTooltipModule, BcPaginatorV2Module],
  templateUrl: './list-all-documents.component.html',
  styleUrl: './list-all-documents.component.scss',
})
export class ListAllDocumentsComponent {
  readonly $data = input.required<IRowDocument[]>();
  readonly $cellOptions = input.required<BcTableOptionMenu[]>();

  readonly $optionSelect = output<ITableDocuments>();

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event.optionSeleted ?? event.optionSelected ?? event.id ?? event.value ?? '';

    const optionPayload: IEventSelectDocument = {
      optionSeleted: rawOption.toUpperCase(),
      rowData: row,
    };

    this.$optionSelect.emit({
      option: optionPayload,
      row,
    });
  }
}
------------

import { TContextualPermission } from '@core/models/permissions-engine.model';


--------------

public readonly $permissionCreate = computed<boolean>(() => {
  const userPermissions =
    (this._globalStoreService.selector('PERMISSIONS')() as TContextualPermission[]) ?? [];
  return PermissionsEngine.evaluate(PERMISSION_DOCUMENTS_CREATE, userPermissions);
});



------------------

public onTableOptionSelect(event: ITableDocuments): void {
  const rawOption = event.option?.optionSeleted ?? '';
  const selectedOption = rawOption.toUpperCase();
  const row = event.row;

  if (!row || !selectedOption) {
    return;
  }

  if (selectedOption === ACTION_OPT2 || selectedOption === EEventSelectItem.OPT2) {
    this.promptDeleteModal(row);
    return;
  }

  if (selectedOption === ACTION_OPT1 || selectedOption === EEventSelectItem.OPT1) {
    this.navigateWithMode(row, MODE_VIEW);
    return;
  }

  if (selectedOption === ACTION_OPT3 || selectedOption === EEventSelectItem.OPT3) {
    this.navigateWithMode(row, MODE_EDIT);
    return;
  }
}