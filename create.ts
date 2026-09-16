// src/app/features/admin/components/list-all-documents/list-all-documents.component.ts

public onOptionSelected(event: any, row: IRowDocument): void {
  // Leemos con y sin typo, o tomamos el id/string directo
  const rawOption = event?.optionSeleted ?? event?.optionSelected ?? event?.id ?? event;
  const optionId = typeof rawOption === 'string' ? rawOption.toUpperCase() : rawOption;

  this.$optionSelect.emit({
    optionSelected: optionId,
    rowData: row,
  } as any);
}








// src/app/features/admin/pages/list-documents/list-documents.component.ts

public onTableOptionSelect(event: any): void {
  // Extraemos la opción resolviendo el typo y normalizando a mayúsculas
  const rawOption = 
    event?.optionSelected ?? 
    event?.optionSeleted ?? 
    event?.option?.optionSelected ?? 
    event?.option?.optionSeleted ?? 
    event?.id ?? 
    event;

  const selectedOption = typeof rawOption === 'string' ? rawOption.toUpperCase() : rawOption;
  const row = event?.rowData ?? event?.row ?? event;

  console.log('Opción procesada:', selectedOption, 'Fila:', row);

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

  // OPT3 o OPT1: Editar
  if (
    selectedOption === 'OPT3' ||
    selectedOption === EEventSelectItem.OPT3 ||
    selectedOption === 'OPT1' ||
    selectedOption === EEventSelectItem.OPT1
  ) {
    this.router.navigate(['/admin/create-document'], {
      queryParams: {
        org: row.organization,
        repo: row.repositoryName,
      },
    });
  }
}