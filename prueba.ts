public resourceGetAllAuthors = rxResource({
  params: () => {
    return {
      email: this.$email(),
      ...this.$filters()
    };
  },
  stream: ({ params }) => {
    const { email, ...filters } = params;
    return this._seniorityServices.getLeaderSubordinates(email, filters);
  },
  defaultValue: {} as unknown as IDevelopers
});



public getLeaderSubordinates(
  email: string | undefined,
  filters?: Record<string, TGenericType>
): Observable<IDevelopers> {
  if (!email) {
    throw new Error('Email is required');
  }

  // Ajusta la ruta base según tu backend (ej. /query/api/v1/leaders/)
  const url = buildApiUrl(
    `${environment.apiBaseUrl}query/api/v1/leaders/${email}`,
    filters
  );

  return this._http.get<ILeader>(url).pipe(
    map(values => this._adapterSeniority.mapListLeaderSubordinates(values)),
    catchError(error => {
      this._eventsService
        .sendEvent('error_load_subordinates', { error })
        .subscribe();
      return of(EMPTY_DEVELOPERS_STATE);
    })
  );
}



public mapListLeaderSubordinates(response: ILeader | ILeader[]): IDevelopers {
  // Aseguramos obtener la lista de subordinados sea objeto único o arreglo
  let rawSubordinados: Subordinado[] = [];

  if (Array.isArray(response)) {
    rawSubordinados = response.flatMap(leader => leader?.subordinados ?? []);
  } else if (response && Array.isArray(response.subordinados)) {
    rawSubordinados = response.subordinados;
  }

  const mappedResults: DeveloperResultItem[] = rawSubordinados.map(item => ({
    position: item.ranking,
    nombreCompleto: item.authorName,
    level: item.level,
    score: item.ranking, // O el valor numérico correspondiente si aplica
    rol: item.typeAuthor,
    authorEmail: item.email
  }));

  return {
    count: mappedResults.length,
    page: 1,
    size: mappedResults.length,
    results: mappedResults
  };
}