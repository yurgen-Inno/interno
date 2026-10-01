import { Component, computed, input, output, signal } from '@angular/core';
import { IDashboardTable, IDashboardTableItem } from '../../../../core/models/tech-dashboards.model';
import { DEFAULT_DASHBOARD_PAGINATION } from '../../../../core/constants/tech-dashboards.constant';

@Component({
  selector: 'app-dashboards-table',
  standalone: true,
  imports: [],
  templateUrl: './dashboards-table.component.html',
  styleUrl: './dashboards-table.component.scss',
})
export class DashboardsTableComponent {
  public tableData = input<IDashboardTable>();
  public pageChange = output<{ currentPage: number; itemsPerPage: number }>();

  public readonly pageSizeOptions = DEFAULT_DASHBOARD_PAGINATION.OPTIONS;

  public displayedColumns = signal<string[]>([
    'evc',
    'scoreDisplay',
    'vicepresidencia',
    'dateDisplay',
    'column5',
    'column6',
    'column7',
    'column8',
    'column9',
  ]);

  public rows = computed<IDashboardTableItem[]>(() => {
    return this.tableData()?.results ?? [];
  });

  public totalItems = computed<number>(() => {
    return this.tableData()?.count ?? 0;
  });

  public currentPage = computed<number>(() => {
    return this.tableData()?.page ?? DEFAULT_DASHBOARD_PAGINATION.PAGE;
  });

  public pageSize = computed<number>(() => {
    return this.tableData()?.size ?? DEFAULT_DASHBOARD_PAGINATION.LIMIT;
  });

  public onPaginatorChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageChange.emit({
      currentPage: event.pageIndex,
      itemsPerPage: event.pageSize,
    });
  }
}



<cb-data-table label="Ranking por score" [data]="rows()">
  <cb-data-table-header>
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
      <strong>Ranking por score</strong>
    </div>
  </cb-data-table-header>

  <cb-data-table-column
    field="evc"
    header="EVC"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="scoreDisplay"
    header="Score Tech Mindfulness"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="vicepresidencia"
    header="Vicepresidencia"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="dateDisplay"
    header="Fecha"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="column5"
    header="Column 5"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="column6"
    header="Column 6"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="column7"
    header="Column 7"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="column8"
    header="Column 8"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

  <cb-data-table-column
    field="column9"
    header="Column 9"
    [sortable]="true"
    [sortIconPosition]="'right'"
  />

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