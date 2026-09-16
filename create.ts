// src/app/features/admin/components/list-all-documents/list-all-documents.component.ts

public onOptionSelected(event: any, row: IRowDocument): void {
  console.log('1. Dropdown disparó:', event, 'en la fila:', row);

  // Extraemos el identificador exacto de la opción seleccionada
  const optionId = typeof event === 'string' ? event : (event?.id ?? event?.optionSelected ?? event?.value);

  // Emitimos un formato estándar y garantizado
  this.$optionSelect.emit({
    optionSelected: optionId,
    rowData: row,
  } as any);
}






($optionSelect)="onTableOptionSelect($event)"



// src/app/features/admin/pages/list-documents/list-documents.component.ts

public onTableOptionSelect(event: any): void {
  console.log('2. Recibido en ListDocumentsComponent:', event);

  // Soporta tanto si viene directo o anidado
  const selectedOption = event?.optionSelected ?? event?.option?.id ?? event?.id ?? event;
  const row = event?.rowData ?? event?.row ?? event;

  console.log('Opción elegida:', selectedOption, 'Fila:', row);

  // OPT2: Eliminar
  if (selectedOption === 'OPT2' || selectedOption === EEventSelectItem.OPT2) {
    this.documentToDelete = row as any;
    this.$modalInformation.update((prev) => ({
      ...prev,
      paragraph: `¿Estás seguro de que deseas eliminar el recurso "${row.repositoryName}"?`,
    }));
    this.modal()?.showModal();
    return;
  }

  // OPT1 o OPT3: Editar
  if (
    selectedOption === 'OPT3' ||
    selectedOption === EEventSelectItem.OPT3 ||
    selectedOption === 'OPT1' ||
    selectedOption === EEventSelectItem.OPT1
  ) {
    console.log('Navegando a editar con:', row.organization, row.repositoryName);
    this.router.navigate(['/admin/create-document'], {
      queryParams: {
        org: row.organization,
        repo: row.repositoryName,
      },
    });
  }
}