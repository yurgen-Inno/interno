it('debe renderizar <nv-icon> y calcular tamaño VOLUNTARY cuando no tenga etiqueta de recompensa', () => {
  fixture.componentRef.setInput('$content', {
    ...mockContent,
    labels: ['bug', 'enhancement'],
  });
  fixture.detectChanges();

  const faIconEl = fixture.debugElement.query(By.css('fa-icon'));
  const nvIconEl = fixture.debugElement.query(By.css('nv-icon'));

  expect(faIconEl).toBeFalsy();
  expect(nvIconEl).toBeTruthy();

  // Validamos que el estado reactivo que alimenta el [size] sea voluntario
  expect(component.$reward().isVoluntary).toBe(true);

  // Y que la constante coincida
  const expectedSize = component.$reward().isVoluntary 
    ? component.iconSizes.VOLUNTARY 
    : component.iconSizes.DEFAULT;
  expect(expectedSize).toBe(ICON_SIZES.VOLUNTARY);

  const voluntarySpan = fixture.debugElement.query(
    By.css('span.bc-opensans-font-style-2-regular')
  );
  expect(voluntarySpan).toBeTruthy();
  expect(voluntarySpan.nativeElement.textContent).toContain('(contribución voluntaria)');
});