  const buildSortParams = (sortState: Record<string, 'asc' | 'desc' | null>) => {
    return Object.entries(sortState)
      .filter(([, direction]) => direction !== null)
      .map(([column, direction]) => `${column},${direction}`);
  };

  export default buildSortParams;