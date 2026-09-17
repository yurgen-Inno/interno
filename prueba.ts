export interface IPaginatorDetailEvent {
  detail?: number | {
    page?: number;
    pageActive?: number;
    pageSelected?: number;
    currentPage?: number;
    itemsPerPage?: number;
  };
}



public onPageChange(event: Event | number): void {
    if (typeof event === 'number') {
      this.$currentPage.set(event);
      return;
    }

    const customEvent = event as unknown as IPaginatorDetailEvent;
    
    // Si detail es directamente el número de página
    if (typeof customEvent?.detail === 'number') {
      this.$currentPage.set(customEvent.detail);
      return;
    }

    // Si detail es un objeto con propiedades
    if (typeof customEvent?.detail === 'object' && customEvent.detail !== null) {
      const pageNumber =
        customEvent.detail.page ??
        customEvent.detail.pageActive ??
        customEvent.detail.pageSelected ??
        customEvent.detail.currentPage;

      if (pageNumber) {
        this.$currentPage.set(pageNumber);
        return;
      }
    }
  }



@if ($data().length > $itemsPerPage()) {
        <bc-paginator-v2
          [totalItems]="$data().length"
          [itemsPerPage]="$itemsPerPage()"
          [attr.page]="$currentPage()"
          (changePage)="onPageChange($event)"
        ></bc-paginator-v2>
      }
