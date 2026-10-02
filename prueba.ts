afterEach(() => {
  // Limpia cualquier petición de catálogo no consumida en tests que no son de recompensas:
  const pendingRewards = httpController.match(`${environment.apiBaseUrl}catalog/api/v1/rewards`);
  pendingRewards.forEach(req => req.flush([]));

  httpController.verify();
});


describe('$rewardsMap signal', () => {
  const rewardsUrl = `${environment.apiBaseUrl}catalog/api/v1/rewards`;
  const mockRewards: IRewards[] = [
    { rewardName: 'aws-voucher', description: 'AWS Voucher', icon: 'icon-cloud' },
    { rewardName: 'github-voucher', description: 'GitHub Voucher', icon: 'icon-cat' },
  ];

  it('should populate $rewardsMap indexed by normalized key when catalog is fetched', () => {
    // 1. Interceptamos la petición disparada por toSignal al crear el servicio:
    const req = httpController.expectOne(rewardsUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRewards);

    // 2. Evaluamos el contenido del Signal:
    const map = spectator.service.$rewardsMap();
    expect(map.size).toBe(2);
    expect(map.has('aws-voucher')).toBe(true);
    expect(map.get('aws-voucher')?.icon).toBe('icon-cloud');
    expect(map.get('github-voucher')?.icon).toBe('icon-cat');
  });

  it('should fallback to empty map in $rewardsMap on HTTP failure', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // 1. Interceptamos la petición y le respondemos con error HTTP:
    const req = httpController.expectOne(rewardsUrl);
    req.flush('Network error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    // 2. Evaluamos que el Signal retenga el Map vacío configurado en el catchError:
    expect(spectator.service.$rewardsMap().size).toBe(0);
  });
});