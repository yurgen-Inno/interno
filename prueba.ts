import { Component, computed, ElementRef, input, output, signal, viewChild, effect } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IPaginatorDetailEvent,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';

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

  private readonly paginatorRef = viewChild<ElementRef<HTMLElement>>('paginatorElement');

  public readonly $currentPage = signal<number>(1);
  public readonly $itemsPerPage = signal<number>(2);

  public readonly $paginatedData = computed<IRowDocument[]>(() => {
    const data = this.$data();
    const startIndex = (this.$currentPage() - 1) * this.$itemsPerPage();
    return data.slice(startIndex, startIndex + this.$itemsPerPage());
  });

  constructor() {
    effect(() => {
      const el = this.paginatorRef()?.nativeElement;
      if (!el) return;

      // Interceptar cualquier evento nativo del web component
      const handler = (e: Event) => {
        console.warn('===> EVENTO DETECTADO:', e.type, (e as CustomEvent).detail);
        const detail = (e as CustomEvent).detail;
        const page = typeof detail === 'number' ? detail : detail?.page ?? detail?.currentPage ?? detail?.pageSelected;
        if (page) {
          this.$currentPage.set(Number(page));
        }
      };

      // Escuchar posibles nombres de eventos nativos
      const eventNames = ['changePage', 'change', 'bcChange', 'pageChange', 'paginationChange', 'click'];
      eventNames.forEach(evt => el.addEventListener(evt, handler));
    });
  }

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption =
      typeof event === 'string'
        ? event
        : event?.optionSeleted ?? event?.optionSelected ?? event?.id ?? event?.value ?? '';

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


@if ($data().length > $itemsPerPage()) {
        <bc-paginator-v2
          #paginatorElement
          [totalItems]="$data().length"
          [itemsPerPage]="$itemsPerPage()"
        ></bc-paginator-v2>
      }