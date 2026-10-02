describe('$isWebIcon', () => {
    it('debe retornar true si el icono es una marca externa (ej: aws, azure, github)', () => {
      // Mockeamos el catálogo para que devuelva un icono externo
      mockRewardsMapSignal.set(
        new Map([
          ['aws-voucher', { rewardName: 'aws-voucher', description: 'AWS', icon: 'aws' }],
        ])
      );

      const mockContent: IContent = {
        labels: ['rw:aws-voucher-3000'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      expect(component.$isWebIcon()).toBe(true);
    });

    it('debe retornar false si el icono inicia con "icon-" (ej: icon-gift, icon-hand-handshake)', () => {
      // Caso con icono nativo de la librería
      mockRewardsMapSignal.set(
        new Map([
          ['cloud-voucher', { rewardName: 'cloud-voucher', description: 'Cloud', icon: 'icon-cloud' }],
        ])
      );

      const mockContent: IContent = {
        labels: ['rw:cloud-voucher'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      expect(component.$isWebIcon()).toBe(false);
    });

    it('debe retornar false si el icono es "puntos-colombia"', () => {
      mockRewardsMapSignal.set(
        new Map([
          ['puntos-colombia', { rewardName: 'puntos-colombia', description: 'Puntos', icon: 'puntos-colombia' }],
        ])
      );

      const mockContent: IContent = {
        labels: ['rw:puntos-colombia'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      expect(component.$isWebIcon()).toBe(false);
    });

    it('debe retornar false si no existe icono o es voluntario', () => {
      const mockContent: IContent = {
        labels: ['documentation'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      // Al no tener etiqueta rw:, el adapter asigna VOLUNTARY_ICON ('icon-hand-handshake')
      expect(component.$isWebIcon()).toBe(false);
    });
  });

  describe('$webIconUrl', () => {
    it('debe construir la URL usando el slug oficial de BRAND_SLUGS (ej: aws -> amazonaws)', () => {
      mockRewardsMapSignal.set(
        new Map([
          ['aws-voucher', { rewardName: 'aws-voucher', description: 'AWS', icon: 'aws' }],
        ])
      );

      const mockContent: IContent = {
        labels: ['rw:aws-voucher-3000'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      expect(component.$webIconUrl()).toBe(
        'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg'
      );
    });

    it('debe construir la URL con el valor crudo si el slug no requiere override (ej: github)', () => {
      mockRewardsMapSignal.set(
        new Map([
          ['github-voucher', { rewardName: 'github-voucher', description: 'GitHub', icon: 'github' }],
        ])
      );

      const mockContent: IContent = {
        labels: ['rw:github-voucher'],
      } as unknown as IContent;

      fixture.componentRef.setInput('$content', mockContent);
      fixture.detectChanges();

      expect(component.$webIconUrl()).toBe(
        'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg'
      );
    });
  });