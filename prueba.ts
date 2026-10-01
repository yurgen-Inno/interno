<cb-data-table label="Ranking por score" [data]="rows()">
  <cb-data-table-header>
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
      <strong>Ranking por score</strong>
    </div>
  </cb-data-table-header>

  @for (col of columnsConfig(); track col.field) {
    <cb-data-table-column
      [field]="col.field"
      [header]="col.header"
      [sortable]="col.sortable"
      [sortIconPosition]="col.sortIconPosition"
    >
      <ng-template let-row>
        <span>{{ row[col.field] }}</span>
      </ng-template>
    </cb-data-table-column>
  }

  <cb-data-table-header-row-def [columns]="displayedColumns()" />
  <cb-data-table-row-def [columns]="displayedColumns()" />

  <cb-paginator
    paginatorType="numeric"
    [length]="totalItems()"
    [pageSize]="pageSize()"
    [pageIndex]="currentPage()"
    [pageSizeOptions]="pageSizeOptions"
    (page)="onPaginatorChange($event)"
  />
</cb-data-table>





public columnsConfig = signal([
  { field: 'evc', header: 'EVC', sortable: true, sortIconPosition: 'right' },
  { field: 'scoreDisplay', header: 'Score Tech Mindfulness', sortable: true, sortIconPosition: 'right' },
  { field: 'vicepresidencia', header: 'Vicepresidencia', sortable: true, sortIconPosition: 'right' },
  { field: 'dateDisplay', header: 'Fecha', sortable: true, sortIconPosition: 'right' },
  { field: 'column5', header: 'Column 5', sortable: true, sortIconPosition: 'right' },
  { field: 'column6', header: 'Column 6', sortable: true, sortIconPosition: 'right' },
  { field: 'column7', header: 'Column 7', sortable: true, sortIconPosition: 'right' },
  { field: 'column8', header: 'Column 8', sortable: true, sortIconPosition: 'right' },
  { field: 'column9', header: 'Column 9', sortable: true, sortIconPosition: 'right' }
]);