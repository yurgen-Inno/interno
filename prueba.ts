public onPageChange(event: unknown): void {
    console.warn('--> EVENTO PAGINADOR DETECTADO:', event);

    if (typeof event === 'number') {
      this.$currentPage.set(event);
      return;
    }

    const customEvent = event as { detail?: unknown };
    const detail = customEvent?.detail;

    if (typeof detail === 'number') {
      this.$currentPage.set(detail);
      return;
    }

    if (typeof detail === 'object' && detail !== null) {
      const pageNum = (detail as Record<string, unknown>)['page'] 
        ?? (detail as Record<string, unknown>)['pageActive']
        ?? (detail as Record<string, unknown>)['currentPage']
        ?? (detail as Record<string, unknown>)['pageSelected'];

      if (typeof pageNum === 'number') {
        this.$currentPage.set(pageNum);
        return;
      }
    }
  }



  @if ($data().length > $itemsPerPage()) {
        <bc-paginator-v2
          [totalItems]="$data().length"
          [itemsPerPage]="$itemsPerPage()"
          (changePage)="onPageChange($event)"
          (changePagination)="onPageChange($event)"
          (bcChange)="onPageChange($event)"
          (pageChange)="onPageChange($event)"
        ></bc-paginator-v2>
      }