const mockProjectsResponse: IResponseDeveloperProjects = {
  count: 1,
  page: 1,
  size: 10,
  data: [
    {
      applicationCode: 'APP-100',
      authorEmail: 'dev@bank.com',
      deltaScoreProject: 2.5,
      directionScoreProject: 'mejora',
      filial: 'BAM',
      levelPreviousProject: 'Junior',
      levelProject: 'Senior',
      scorePreviousProject: 80,
      scoreProject: 88.5,
      subIndicadores: {} as any,
    },
  ],
};

const mockProjectsMapped: Project[] = [
  {
    levelProject: 'Senior',
    applicationCode: 'APP-100',
    scoreProject: 88.5,
    projectTime: '14 meses',
  },
];



describe('getAllDeveloperProjects', () => {
  it('should build the projects url, apply filters and map the response', (done) => {
    httpClient.get.mockReturnValue(of(mockProjectsResponse));
    adapter.mapListProjects.mockReturnValue(mockProjectsMapped);

    spectator.service
      .getAllDeveloperProjects('dev@bank.com', { page: 1, limit: 10 })
      .subscribe((result) => {
        expect(httpClient.get).toHaveBeenCalledTimes(1);

        const calledUrl = httpClient.get.mock.calls[0][0] as string;
        expect(calledUrl).toContain('/query/api/v1/projects/authors/dev@bank.com');
        expect(calledUrl).toContain('page=1');
        expect(calledUrl).toContain('limit=10');

        expect(adapter.mapListProjects).toHaveBeenCalledWith(mockProjectsResponse);
        expect(result).toEqual(mockProjectsMapped);
        done();
      });
  });

  it('should report event and return empty array as Project[] on error', (done) => {
    const error = new Error('projects failure');
    httpClient.get.mockReturnValue(throwError(() => error));

    spectator.service.getAllDeveloperProjects('dev@bank.com', {}).subscribe((result) => {
      expect(eventService.sendEvent).toHaveBeenCalledWith(
        'error_load_authors',
        { error } as unknown as Record<string, string>
      );
      expect(result).toEqual({} as unknown as Project[]);
      done();
    });
  });

  it('should throw synchronously when email is undefined', () => {
    expect(() => spectator.service.getAllDeveloperProjects(undefined, {})).toThrow(
      'Email is required'
    );
    expect(httpClient.get).not.toHaveBeenCalled();
  });

  it('should throw synchronously when email is an empty string', () => {
    expect(() => spectator.service.getAllDeveloperProjects('', {})).toThrow(
      'Email is required'
    );
    expect(httpClient.get).not.toHaveBeenCalled();
  });
});