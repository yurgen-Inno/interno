describe('mapListProjects', () => {
  it('should map developer projects correctly when data is present', () => {
    const mockResponse: IResponseDeveloperProjects = {
      count: 1,
      page: 1,
      size: 10,
      data: [
        {
          applicationCode: 'APP-100',
          authorEmail: 'dev@bank.com',
          deltaScoreProject: 1.5,
          directionScoreProject: 'mejora',
          filial: 'BAM',
          levelPreviousProject: 'Junior',
          levelProject: 'Senior',
          scorePreviousProject: 80,
          scoreProject: 92.5,
          subIndicadores: {} as any,
        },
      ],
    };

    const result = spectator.service.mapListProjects(mockResponse);

    expect(result).toEqual([
      {
        applicationCode: 'APP-100',
        levelProject: 'Senior',
        scoreProject: 92.5,
        projectTime: '5 Meses',
      },
    ]);
  });

  it('should return an empty array when data is an empty array', () => {
    const mockResponse: IResponseDeveloperProjects = {
      count: 0,
      page: 1,
      size: 10,
      data: [],
    };

    const result = spectator.service.mapListProjects(mockResponse);

    expect(result).toEqual([]);
  });

  it('should return an empty array when data is missing or undefined (edge case)', () => {
    const mockResponse = {
      count: 0,
      page: 1,
      size: 10,
      data: undefined,
    } as unknown as IResponseDeveloperProjects;

    const result = spectator.service.mapListProjects(mockResponse);

    expect(result).toEqual([]);
  });
});







describe('mapListDevelopers', () => {
  it('should map developers array to IDevelopers object structure', () => {
    const mockResponse: IResponseDevelopers = [
      {
        position: 1,
        nombreCompleto: 'Pepito Perez',
        level: 'Senior',
        score: 95.5,
        typeAuthor: 'Developer',
        authorEmail: 'pepito@bank.com',
      } as IDevelopersAuthor,
    ];

    const result = spectator.service.mapListDevelopers(mockResponse);

    expect(result).toEqual({
      count: 1,
      page: DEFAULT_PAGINATION.PAGE,
      size: 1,
      results: [
        {
          position: 1,
          nombreCompleto: 'Pepito Perez',
          level: 'Senior',
          score: 95.5,
          rol: 'Developer',
        },
      ],
    });
  });

  it('should return empty results with count 0 when input array is empty', () => {
    const mockResponse: IResponseDevelopers = [];

    const result = spectator.service.mapListDevelopers(mockResponse);

    expect(result).toEqual({
      count: 0,
      page: DEFAULT_PAGINATION.PAGE,
      size: 0,
      results: [],
    });
  });

  it('should handle non-array or null input safely (edge case)', () => {
    const mockResponse = null as unknown as IResponseDevelopers;

    const result = spectator.service.mapListDevelopers(mockResponse);

    expect(result).toEqual({
      count: 0,
      page: DEFAULT_PAGINATION.PAGE,
      size: 0,
      results: [],
    });
  });
});