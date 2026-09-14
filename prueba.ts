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

  // 1. Decodificar caracteres especiales y unificar el separador ? a /
  let decodedPath = decodeURIComponent(selectedPath).replace('?', '/');
  decodedPath = decodedPath.replace(/\/+$/, '');

  const pathParts = decodedPath.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] ?? '';

  // 2. Si no termina explícitamente en archivo (.md), se apunta a README.md
  const hasExplicitFile = lastPart.includes('.');
  const activeDocumentPath = hasExplicitFile
    ? decodedPath
    : `${decodedPath}/README.md`;

  const folderPath = hasExplicitFile
    ? decodedPath.substring(0, decodedPath.lastIndexOf('/'))
    : decodedPath;

  const nodes = this.$elementsExpanded()?.results ?? [];

  // Pasa el targetDocumentPath para seleccionar el README solo cuando termine de abrir carpetas
  this.expandPathToSelection(folderPath, nodes, repository, activeDocumentPath);
}


private expandPathToSelection(
  path: string,
  nodes: IDocumentationTreeItem[],
  repository: IResponseRepositories,
  targetDocumentPath?: string
): void {
  if (!path || !nodes || nodes.length === 0) {
    return;
  }

  const segments = path.split('/').filter(Boolean);
  let currentNodes = nodes;

  for (const segment of segments) {
    const nextNode = currentNodes.find(
      item =>
        (item.name === segment || item.path?.endsWith('/' + segment)) &&
        item.type === ETypeFile.FOLDER
    );

    if (!nextNode) {
      return;
    }

    if (!nextNode.expanded) {
      nextNode.expanded = true;
      this.nestElementsInParent(nextNode, repository);
      return; // Detiene la ejecución esperando la respuesta HTTP
    }

    currentNodes = nextNode.children?.results ?? [];
  }

  // Se ejecuta únicamente cuando todas las carpetas ya están abiertas y descargadas
  if (targetDocumentPath && currentNodes.length > 0) {
    // CONDICIÓN ANTI-LOOP: si ya está activo este archivo, no vuelve a emitir
    if (this.$activeNodePath() !== targetDocumentPath) {
      const readmeNode = currentNodes.find(
        item =>
          item.path === targetDocumentPath ||
          item.name?.toLowerCase() === 'readme.md'
      );

      if (readmeNode) {
        this.$activeNodePath.set(targetDocumentPath);
        this.selectFile(readmeNode);
      }
    }
  }
}