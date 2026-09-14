public toggleNode(node: IDocumentationTreeItem): void {
  if (node.type === ETypeFile.FOLDER) {
    const repository = this.$elementsExpandedRepository();
    node.expanded = !node.expanded;

    if (repository && node.expanded) {
      const readmePath = `${node.path}/README.md`;

      const element: IDocumentSelected = {
        ...repository,
        ...node,
        expanded: node.expanded,
        path: readmePath
      };

      this.$activeNodePath.set(readmePath);
      this.$fileSelected.emit(element);
      this.nestElementsInParent(node, repository);
    }
  }
}

public nestElementsInParent(
  node: IDocumentationTreeItem,
  repository: IResponseRepositories
): void {
  node.loading = true;
  this._documentationService
    .getListDocumentNest(repository, node.path)
    .subscribe({
      next: (response: any) => {
        const resultsArray = Array.isArray(response) ? response : (response?.results ?? []);
        node.children = { results: resultsArray } as any;
        node.loading = false;

        this.$elementsExpanded.update(current => {
          if (!current) return current;
          return {
            ...current,
            results: current.results.map(item =>
              item.path === node.path ? { ...node } : item
            )
          };
        });

        setTimeout(() => {
          this.restoreTreeSelection(repository, this.selectedPath());
        }, 0);
      },
      error: () => {
        node.loading = false;
      }
    });
}

private restoreTreeSelection(
  repository: IResponseRepositories | null = this.selectedRepository(),
  selectedPath: string | null = this.selectedPath()
): void {
  if (!repository || !selectedPath) {
    return;
  }

  let decodedPath = decodeURIComponent(selectedPath).replace('?', '/').replace(/\/+$/, '');

  const pathParts = decodedPath.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] ?? '';
  const hasExplicitFile = lastPart.includes('.');

  const activeDocumentPath = hasExplicitFile
    ? decodedPath
    : `${decodedPath}/README.md`;

  if (this.$activeNodePath() === activeDocumentPath) {
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

  if (targetDocumentPath && currentNodes.length > 0 && shouldEmitFile) {
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