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

  // 1. Decodificar y normalizar separadores
  let decodedPath = decodeURIComponent(selectedPath).replace('?', '/');

  // Limpiar posibles barras duplicadas o finales
  decodedPath = decodedPath.replace(/\/+$/, '');

  const pathParts = decodedPath.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] ?? '';

  // 2. Si la ruta termina en carpeta, asumimos que su archivo activo es README.md
  const hasExplicitFile = lastPart.includes('.');
  const activeDocumentPath = hasExplicitFile 
    ? decodedPath 
    : `${decodedPath}/README.md`;

  const folderPath = hasExplicitFile
    ? decodedPath.substring(0, decodedPath.lastIndexOf('/'))
    : decodedPath;

  const nodes = this.$elementsExpanded()?.results ?? [];

  // Siempre expandimos hasta la carpeta destino
  this.expandPathToSelection(folderPath, nodes, repository, activeDocumentPath);

  // Marcamos como activo el archivo resultante (sea el explícito o el README.md)
  this.$activeNodePath.set(activeDocumentPath);
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
      item => (item.name === segment || item.path?.endsWith('/' + segment)) && item.type === ETypeFile.FOLDER
    );

    if (!nextNode) {
      return;
    }

    if (!nextNode.expanded) {
      nextNode.expanded = true;
      this.nestElementsInParent(nextNode, repository);
      return; // Espera a que termine la llamada HTTP
    }

    currentNodes = nextNode.children?.results ?? [];
  }

  // Si ya llegó al final de los segmentos de carpetas y tenemos un documento objetivo
  if (targetDocumentPath && currentNodes.length > 0) {
    const readmeNode = currentNodes.find(
      item => item.path === targetDocumentPath || 
              item.name?.toLowerCase() === 'readme.md'
    );

    if (readmeNode) {
      // Emite el evento de selección para cargar el markdown en pantalla
      this.selectFile(readmeNode);
    }
  }
}