public nestElementsInParent(
  node: IDocumentationTreeItem,
  repository: IResponseRepositories
): void {
  node.loading = true;
  this._documentationService
    .getListDocumentNest(repository, node.path)
    .subscribe({
      next: (response: any) => {
        // Tu HTML exige node.children.results:
        const resultsArray = Array.isArray(response) ? response : (response?.results ?? []);
        node.children = { results: resultsArray } as any;
        node.loading = false;

        // Tu lógica original que notifica al Signal y restaura el clic manual:
        this.$elementsExpanded.update(current => {
          if (!current) return current;
          return {
            ...current,
            results: current.results.map(item =>
              item.path === node.path ? { ...node } : item
            )
          };
        });

        // Continuar bajando en el árbol pasando los parámetros necesarios:
        setTimeout(() => {
          this.restoreTreeSelection(repository, this.selectedPath());
        }, 0);
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
    const nextNode = currentNodes.find(
      item => (item.name === segment || item.path?.endsWith('/' + segment)) && item.type === ETypeFile.FOLDER
    );

    if (!nextNode) {
      return;
    }

    if (!nextNode.expanded) {
      nextNode.expanded = true;
      this.nestElementsInParent(nextNode, repository);
      return; // Se detiene a esperar la respuesta HTTP
    }

    // Leemos exactamente de .results como lo tiene tu HTML:
    currentNodes = nextNode.children?.results ?? [];
  }
}


private restoreTreeSelection(
  repository: IResponseRepositories | null = this.selectedRepository(),
  selectedPath: string | null = this.selectedPath()
): void {
  if (!repository || !selectedPath) {
    return;
  }

  const currentRepository = this.$elementsExpandedRepository();
  const isCurrentRepository =
    !!currentRepository &&
    currentRepository.organization === repository.organization &&
    currentRepository.repository === repository.repository;

  if (!isCurrentRepository) {
    const matchingRepository = this.resourceRepositories
      .value()
      ?.find(
        item =>
          item.organization === repository.organization &&
          item.repository === repository.repository
      );

    if (matchingRepository) {
      this.expandRepository(matchingRepository);
      return;
    }
  }

  // 1. Decodificar caracteres URL (%2F -> / y %3F -> ?)
  let decodedPath = decodeURIComponent(selectedPath);

  // 2. Unificar el separador del archivo ? convirtiéndolo a /
  decodedPath = decodedPath.replace('?', '/');

  const pathParts = decodedPath.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] ?? '';
  const isDocumentPath = lastPart.includes('.');

  const folderPath = isDocumentPath
    ? decodedPath.substring(0, decodedPath.lastIndexOf('/'))
    : decodedPath;

  const nodes = this.$elementsExpanded()?.results ?? [];

  if (isDocumentPath) {
    this.expandPathToSelection(folderPath, nodes, repository);
  }

  this.$activeNodePath.set(isDocumentPath ? decodedPath : null);
}