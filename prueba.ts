it('debe renderizar <nv-icon> con tamaño VOLUNTARY cuando no tenga etiqueta de recompensa', () => {
  fixture.componentRef.setInput('$content', {
    ...mockContent,
    labels: ['bug', 'enhancement'],
  });
  fixture.detectChanges();

  const faIconEl = fixture.debugElement.query(By.css('fa-icon'));
  const nvIconEl = fixture.debugElement.query(By.css('nv-icon'));

  expect(faIconEl).toBeFalsy();
  expect(nvIconEl).toBeTruthy();

  // Lee desde nativeElement (soporta tanto propiedad de Web Component como atributo HTML)
  const actualSize =
    nvIconEl.nativeElement.getAttribute('size') ??
    nvIconEl.nativeElement.size;

  expect(actualSize).toBe(ICON_SIZES.VOLUNTARY);

  const voluntarySpan = fixture.debugElement.query(
    By.css('span.bc-opensans-font-style-2-regular')
  );
  expect(voluntarySpan).toBeTruthy();
  expect(voluntarySpan.nativeElement.textContent).toContain('(contribución voluntaria)');
});