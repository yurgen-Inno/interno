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
    // Log para ver con qué nombre llega cada carpeta
    console.log('Buscando segmento:', segment, 'en nodos actuales:', currentNodes);

    // Comparación defensiva: revisa name, label o si el path termina con el segmento
    const nextNode = currentNodes.find(item => {
      const nameMatch = (item.name === segment) || ((item as any).label === segment);
      const pathMatch = item.path?.endsWith('/' + segment) || item.path === segment;
      return (nameMatch || pathMatch) && item.type === ETypeFile.FOLDER;
    });

    if (!nextNode) {
      console.warn(`No se encontró el nodo para el segmento: "${segment}". Revisa las propiedades del nodo en el log anterior.`);
      return;
    }

    if (!nextNode.expanded) {
      nextNode.expanded = true;

      // Forzar recreación profunda del array para que Angular y Caribe detecten el cambio
      this.$elementsExpanded.update(curr => {
        if (!curr) return undefined;
        return {
          ...curr,
          results: structuredClone ? structuredClone(curr.results) : JSON.parse(JSON.stringify(curr.results))
        };
      });

      this.nestElementsInParent(nextNode, repository);
      return;
    }

    // Asegurar compatibilidad con la estructura que retorna la API para los hijos
    const childrenContainer: any = nextNode.children;
    currentNodes = Array.isArray(childrenContainer) 
      ? childrenContainer 
      : (childrenContainer?.results ?? []);
  }
}