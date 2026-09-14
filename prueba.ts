public nestElementsInParent(
  node: IDocumentationTreeItem,
  repository: IResponseRepositories
): void {
  node.loading = true;
  this._documentationService
    .getListDocumentNest(repository, node.path)
    .subscribe({
      next: (response: any) => {
        // Normaliza si el backend devuelve un array directo o un objeto con .results
        const items = Array.isArray(response)
          ? response
          : (response?.results ?? []);

        node.children = items;
        node.loading = false;

        // Fuerza la reactividad en el Signal clonando los resultados
        this.$elementsExpanded.update(current => {
          if (!current) return undefined;
          return {
            ...current,
            results: [...current.results]
          };
        });

        // Continúa la apertura recursiva para el siguiente nivel
        this.restoreTreeSelection(repository, this.selectedPath());
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
    // Busca coincidencia flexible por nombre o fragmento de path
    const nextNode = currentNodes.find(item => {
      const matchName = item.name === segment || (item as any).label === segment;
      const matchPath = item.path === segment || item.path?.endsWith(`/${segment}`);
      return (matchName || matchPath) && item.type === ETypeFile.FOLDER;
    });

    if (!nextNode) {
      return;
    }

    // Si la carpeta encontrada aún está colapsada, se expande y se piden sus hijos
    if (!nextNode.expanded) {
      nextNode.expanded = true;

      // Notifica el cambio de estado de apertura a la vista
      this.$elementsExpanded.update(current => {
        if (!current) return undefined;
        return {
          ...current,
          results: [...current.results]
        };
      });

      // Dispara la carga asíncrona; al terminar volverá a invocar restoreTreeSelection
      this.nestElementsInParent(nextNode, repository);
      return;
    }

    // Si ya estaba expandida, extrae los hijos sin importar si vienen como array o como { results: [] }
    const rawChildren: any = nextNode.children;
    if (Array.isArray(rawChildren)) {
      currentNodes = rawChildren;
    } else if (rawChildren && Array.isArray(rawChildren.results)) {
      currentNodes = rawChildren.results;
    } else {
      currentNodes = [];
    }
  }
}