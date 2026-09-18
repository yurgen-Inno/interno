import { ActivatedRoute, Router } from '@angular/router';
import { EResourceViewMode, IDocumentationResource } from '@core/models/documents.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { CreatedDocumentComponent } from './create-document.component';

describe('CreatedDocumentComponent', () => {
  let spectator: Spectator<CreatedDocumentComponent>;

  const mockResource: IDocumentationResource = {
    organization: 'grupobancolombia-innersource',
    repositoryName: 'NU5740001_Mundo_Test',
    name: 'Documentación Métricas Corporativas',
    description: 'Descripción del repositorio',
    url: 'https://github.com/repo',
    lastSyncedAt: '2026-09-16T12:00:00Z',
  };

  const mockDocService = {
    getResourceById: jest.fn().mockReturnValue(of(mockResource)),
    createResource: jest.fn().mockReturnValue(of(mockResource)),
    updateResource: jest.fn().mockReturnValue(of(mockResource)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockEventsService = {
    sendEvent: jest.fn().mockReturnValue(of({})),
  };

  const createComponent = createComponentFactory({
    component: CreatedDocumentComponent,
    shallow: true,
    providers: [
      { provide: DocumentationService, useValue: mockDocService },
      { provide: Router, useValue: mockRouter },
      { provide: EventsService, useValue: mockEventsService },
    ],
    detectChanges: false,
  });

  const setupComponent = (queryParams: Record<string, string | null> = {}) => {
    spectator = createComponent({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => queryParams[key] ?? null,
              },
            },
          },
        },
      ],
    });
    spectator.component.ngOnInit();
    spectator.detectChanges();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDocService.getResourceById.mockReturnValue(of(mockResource));
    mockDocService.createResource.mockReturnValue(of(mockResource));
    mockDocService.updateResource.mockReturnValue(of(mockResource));
    mockEventsService.sendEvent.mockReturnValue(of({}));
  });

  describe('Create Mode (default)', () => {
    beforeEach(() => {
      setupComponent();
    });

    it('should initialize in create mode with enabled fields', () => {
      expect(spectator.component.$isEditMode()).toBe(false);
      expect(spectator.component.$isViewMode()).toBe(false);
      expect(spectator.component.resourceForm.controls.organization.enabled).toBe(true);
      expect(spectator.component.resourceForm.controls.repositoryName.enabled).toBe(true);
    });

    it('should not submit if form is invalid', () => {
      spectator.component.resourceForm.reset();
      spectator.component.onSubmit();

      expect(mockDocService.createResource).not.toHaveBeenCalled();
    });

    it('should call createResource and navigate on valid form submit', () => {
      spectator.component.resourceForm.setValue({
        organization: 'grupobancolombia-innersource',
        repositoryName: 'NU5740001_Metrics_Doc',
        name: 'Métricas',
        description: 'Desc',
        url: 'https://github.com/repo',
      });

      spectator.component.onSubmit();

      expect(mockDocService.createResource).toHaveBeenCalledWith({
        organization: 'grupobancolombia-innersource',
        repositoryName: 'NU5740001_Metrics_Doc',
        name: 'Métricas',
        description: 'Desc',
        url: 'https://github.com/repo',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });

    it('should set $errorMessage and send event when createResource fails', () => {
      mockDocService.createResource.mockReturnValue(
        throwError(() => ({ error: { message: 'El recurso ya existe' } }))
      );

      spectator.component.resourceForm.setValue({
        organization: 'org',
        repositoryName: 'repo',
        name: '',
        description: '',
        url: '',
      });

      spectator.component.onSubmit();

      expect(spectator.component.$errorMessage()).toBe('El recurso ya existe');
      expect(spectator.component.$isSubmitting()).toBe(false);
      expect(mockEventsService.sendEvent).toHaveBeenCalledWith(
        'error_notification',
        { message: 'El recurso ya existe' }
      );
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      setupComponent({
        org: 'grupobancolombia-innersource',
        repo: 'NU5740001_Metrics_Doc',
        mode: EResourceViewMode.EDIT,
      });
    });

    it('should initialize in edit mode and disable identity fields', () => {
      expect(spectator.component.$isEditMode()).toBe(true);
      expect(spectator.component.$isViewMode()).toBe(false);
      expect(spectator.component.resourceForm.controls.organization.disabled).toBe(true);
      expect(spectator.component.resourceForm.controls.repositoryName.disabled).toBe(true);
      expect(mockDocService.getResourceById).toHaveBeenCalledWith(
        'grupobancolombia-innersource',
        'NU5740001_Metrics_Doc'
      );
    });

    it('should call updateResource with editable fields only on submit', () => {
      spectator.component.resourceForm.patchValue({
        name: 'Nombre Editado',
        description: 'Nueva descripción',
        url: 'https://github.com/updated',
      });

      spectator.component.onSubmit();

      expect(mockDocService.updateResource).toHaveBeenCalledWith(
        'grupobancolombia-innersource',
        'NU5740001_Metrics_Doc',
        {
          name: 'Nombre Editado',
          description: 'Nueva descripción',
          url: 'https://github.com/updated',
        }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });

    it('should set $errorMessage and send event when updateResource fails', () => {
      mockDocService.updateResource.mockReturnValue(
        throwError(() => ({ error: { message: 'Error al actualizar' } }))
      );

      spectator.component.onSubmit();

      expect(spectator.component.$errorMessage()).toBe('Error al actualizar');
      expect(spectator.component.$isSubmitting()).toBe(false);
      expect(mockEventsService.sendEvent).toHaveBeenCalledWith(
        'error_notification',
        { message: 'Error al actualizar' }
      );
    });

    it('should notify error when loadResourceData fails', () => {
      mockDocService.getResourceById.mockReturnValue(
        throwError(() => new Error('Error general'))
      );

      setupComponent({
        org: 'grupobancolombia-innersource',
        repo: 'NU5740001_Metrics_Doc',
        mode: EResourceViewMode.EDIT,
      });

      expect(spectator.component.$errorMessage()).toBe('No se pudo cargar la información del recurso.');
      expect(mockEventsService.sendEvent).toHaveBeenCalledWith(
        'error_notification',
        { message: 'No se pudo cargar la información del recurso.' }
      );
    });
  });

  describe('View Mode', () => {
    beforeEach(() => {
      setupComponent({
        org: 'grupobancolombia-innersource',
        repo: 'NU5740001_Metrics_Doc',
        mode: EResourceViewMode.VIEW,
      });
    });

    it('should disable entire form when in view mode', () => {
      expect(spectator.component.$isViewMode()).toBe(true);
      expect(spectator.component.resourceForm.disabled).toBe(true);
    });

    it('should not execute submit in view mode', () => {
      spectator.component.onSubmit();

      expect(mockDocService.createResource).not.toHaveBeenCalled();
      expect(mockDocService.updateResource).not.toHaveBeenCalled();
    });
  });

  describe('Computed Titles and Buttons', () => {
    it('should show correct texts in Create Mode', () => {
      setupComponent();

      expect(spectator.component.$headerTitle()).toBe('Crear recurso de documentación');
      expect(spectator.component.$headerSubtitle()).toBe('Registrar nuevo repositorio');
      expect(spectator.component.$cancelButtonText()).toBe('Cancelar');
      expect(spectator.component.$submitButtonText()).toBe('Guardar recurso');
    });

    it('should show correct texts in Edit Mode', () => {
      setupComponent({
        org: 'grupobancolombia-innersource',
        repo: 'NU5740001_Metrics_Doc',
        mode: EResourceViewMode.EDIT,
      });

      expect(spectator.component.$headerTitle()).toBe('Editar recurso de documentación');
      expect(spectator.component.$headerSubtitle()).toBe('Actualizar información del repositorio');
      expect(spectator.component.$cancelButtonText()).toBe('Cancelar');
      expect(spectator.component.$submitButtonText()).toBe('Actualizar recurso');
    });

    it('should show correct texts in View Mode', () => {
      setupComponent({
        org: 'grupobancolombia-innersource',
        repo: 'NU5740001_Metrics_Doc',
        mode: EResourceViewMode.VIEW,
      });

      expect(spectator.component.$headerTitle()).toBe('Detalle del recurso de documentación');
      expect(spectator.component.$headerSubtitle()).toBe('Visualización en modo lectura');
      expect(spectator.component.$cancelButtonText()).toBe('Volver');
    });
  });

  describe('onCancel', () => {
    it('should navigate back to list-documents', () => {
      setupComponent();

      spectator.component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });
  });
});