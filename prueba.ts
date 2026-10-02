describe('getRewards', () => {
  const rewardsUrl = `${environment.apiBaseUrl}catalog/api/v1/rewards`;
  const mockRewards: IRewards[] = [
    { rewardName: 'aws-voucher', description: 'AWS Voucher', icon: 'icon-cloud' },
    { rewardName: 'github-voucher', description: 'GitHub Voucher', icon: 'icon-cat' },
  ];

  it('should fetch the rewards from the correct endpoint', () => {
    // 1. Resuelve la petición que toSignal abrió al instanciar el servicio
    httpController.expectOne(rewardsUrl).flush([]);

    // 2. Ejecuta la llamada bajo prueba
    spectator.service.getRewards().subscribe(response => {
      expect(response).toEqual(mockRewards);
      expect(response.length).toBe(2);
    });

    // 3. Responde a la petición propia de este test
    const req = httpController.expectOne(rewardsUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRewards);
  });

  it('should handle an empty rewards response', () => {
    // 1. Resuelve la petición inicial de toSignal
    httpController.expectOne(rewardsUrl).flush([]);

    // 2. Ejecuta la llamada
    spectator.service.getRewards().subscribe(response => {
      expect(response).toEqual([]);
    });

    // 3. Responde con arreglo vacío
    const req = httpController.expectOne(rewardsUrl);
    req.flush([]);
  });

  it('should propagate an HTTP error', () => {
    // 1. Resuelve la petición inicial de toSignal
    httpController.expectOne(rewardsUrl).flush([]);

    // 2. Ejecuta la llamada esperando el error
    spectator.service.getRewards().subscribe({
      error: err => {
        expect(err.status).toBe(500);
      },
    });

    // 3. Emite el error 500
    const req = httpController.expectOne(rewardsUrl);
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});