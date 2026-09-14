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

  let decodedPath = decodeURIComponent(selectedPath).replace('?', '/');
  decodedPath = decodedPath.replace(/\/+$/, '');

  const pathParts = decodedPath.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] ?? '';

  const hasExplicitFile = lastPart.includes('.');
  const activeDocumentPath = hasExplicitFile
    ? decodedPath
    : `${decodedPath}/README.md`;

  const folderPath = hasExplicitFile
    ? decodedPath.substring(0, decodedPath.lastIndexOf('/'))
    : decodedPath;

  this.$activeNodePath.set(activeDocumentPath);

  const nodes = this.$elementsExpanded()?.results ?? [];

  const shouldEmitFile = !hasExplicitFile;

  this.expandPathToSelection(folderPath, nodes, repository, activeDocumentPath, shouldEmitFile);
}


private expandPathToSelection(
  path: string,
  nodes: IDocumentationTreeItem[],
  repository: IResponseRepositories,
  targetDocumentPath?: string,
  shouldEmitFile: boolean = false
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
      return;
    }

    currentNodes = nextNode.children?.results ?? [];
  }

  if (targetDocumentPath && currentNodes.length > 0) {
    if (shouldEmitFile) {
      const readmeNode = currentNodes.find(
        item =>
          item.path === targetDocumentPath ||
          item.name?.toLowerCase() === 'readme.md'
      );

      if (readmeNode) {
        this.selectFile(readmeNode);
      }
    }
  }
}