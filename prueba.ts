public nestElementsInParent(
  node: IDocumentationTreeItem,
  repository: IResponseRepositories
): void {
  node.loading = true;
  this._documentationService
    .getListDocumentNest(repository, node.path)
    .subscribe({
      next: (response: any) => {
        const items = Array.isArray(response)
          ? response
          : (response?.results ?? []);

        // Asignación directa como lo tenías originalmente
        node.children = items;
        node.loading = false;

        // Si tu modelo maneja results en children:
        (node as any).results = items;

        // Espera un tick del ciclo de eventos para que Angular pinte los hijos en el DOM
        setTimeout(() => {
          this.restoreTreeSelection(repository, this.selectedPath());
        }, 50);
      },
      error: () => {
        node.loading = false;
      }
    });
}

private expandPathToSelection(
  path: string,
  nodes: IDocumentationTreeItem[],
  repository: IResponseRepositories
): void {
  if (!path || !nodes || nodes.length === 0) {
    return;
  }

  const segments = path.split('/').filter(Boolean);
  let currentNodes = nodes;

  for (const segment of segments) {
    const nextNode = currentNodes.find(item => {
      const matchName = item.name === segment || (item as any).label === segment;
      const matchPath = item.path === segment || item.path?.endsWith(`/${segment}`);
      return (matchName || matchPath) && item.type === ETypeFile.FOLDER;
    });

    if (!nextNode) {
      return;
    }

    if (!nextNode.expanded) {
      nextNode.expanded = true;
      // Llamar directamente a cargar los hijos sin disparar updates forzados al signal
      this.nestElementsInParent(nextNode, repository);
      return;
    }

    // Extrae los hijos buscando en children o en results
    const rawChildren: any = nextNode.children;
    if (Array.isArray(rawChildren)) {
      currentNodes = rawChildren;
    } else if (rawChildren && Array.isArray(rawChildren.results)) {
      currentNodes = rawChildren.results;
    } else if (Array.isArray((nextNode as any).results)) {
      currentNodes = (nextNode as any).results;
    } else {
      currentNodes = [];
    }
  }
}