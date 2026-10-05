public readonly $tabs = signal(TABS_MENU_TECHD);
  public readonly $activeTabId = signal<string>('summary');

  public onTabSelected(event: { id?: string } | string | number): void {
    const selectedId = typeof event === 'object' ? event?.id : this.$tabs()[Number(event)]?.id ?? String(event);
    if (!selectedId) return;

    this.$activeTabId.set(selectedId);
  }



  <cb-tabs
    [tabs]="$tabs()"
    [activeTabId]="$activeTabId()"
    (tabSelected)="onTabSelected($event)"
  />

  @if ($activeTabId() === 'summary') {
    <app-dashboards-cards
      [cards]="$overviewData()?.kpiCards ?? []"
      [thresholds]="$overviewData()?.scoreThresholds"
    />

    <app-dashboard-bars [data]="$overviewData()?.pillarComparison" />

    <app-dashboards-table
      [tableData]="$tableData()"
      (pageChange)="onChangePage($event)"
    />
  } @else {
    <div class="tab-placeholder bc-mt-4">
      <p>Sección en desarrollo: {{ $activeTabId() }}</p>
    </div>
  }