import { ActivatedRoute, Router } from '@angular/router';
import { IDocumentationResource } from '@core/models/documents.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { CreateDocumentComponent } from './create-document.component';

describe('CreateDocumentComponent', () => {
  let spectator: Spectator<CreateDocumentComponent>;

  const mockResource: IDocumentationResource = {
    organization: 'grupobancolombia-innersource',
    repositoryName: 'NU5740001_Metrics_Doc',
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

  const createComponent = createRoutingFactory({
    component: CreateDocumentComponent,
    providers: [
      { provide: DocumentationService, useValue: mockDocService },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDocService.getResourceById.mockReturnValue(of(mockResource));
    mockDocService.createResource.mockReturnValue(of(mockResource));
    mockDocService.updateResource.mockReturnValue(of(mockResource));
  });

  describe('Create Mode (default)', () => {
    beforeEach(() => {
      spectator = createComponent({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                queryParamMap: {
                  get: jest.fn().mockReturnValue(null),
                },
              },
            },
          },
        ],
      });
      spectator.detectChanges();
    });

    it('should initialize in create mode with enabled fields', () => {
      expect(spectator.component.isEditMode()).toBe(false);
      expect(spectator.component.isViewMode()).toBe(false);
      expect(spectator.component.resourceForm.get('organization')?.enabled).toBe(true);
      expect(spectator.component.resourceForm.get('repositoryName')?.enabled).toBe(true);
    });

    it('should not submit if form is invalid', () => {
      spectator.component.resourceForm.reset();
      spectator.component.onSubmit();

      expect(mockDocService.createResource).not.toHaveBeenCalled();
    });

    it('should call createResource and navigate on valid form submit', () => {
      const router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');

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
      expect(router.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });

    it('should set errorMessage when createResource fails', () => {
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

      expect(spectator.component.errorMessage()).toBe('El recurso ya existe');
      expect(spectator.component.isSubmitting()).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      spectator = createComponent({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                queryParamMap: {
                  get: jest.fn((key: string) => {
                    if (key === 'org') return 'grupobancolombia-innersource';
                    if (key === 'repo') return 'NU5740001_Metrics_Doc';
                    if (key === 'mode') return 'edit';
                    return null;
                  }),
                },
              },
            },
          },
        ],
      });
      spectator.detectChanges();
    });

    it('should initialize in edit mode and disable identity fields', () => {
      expect(spectator.component.isEditMode()).toBe(true);
      expect(spectator.component.isViewMode()).toBe(false);
      expect(spectator.component.resourceForm.get('organization')?.disabled).toBe(true);
      expect(spectator.component.resourceForm.get('repositoryName')?.disabled).toBe(true);
      expect(mockDocService.getResourceById).toHaveBeenCalledWith(
        'grupobancolombia-innersource',
        'NU5740001_Metrics_Doc'
      );
    });

    it('should call updateResource with editable fields only on submit', () => {
      const router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');

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
      expect(router.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });
  });

  describe('View Mode', () => {
    beforeEach(() => {
      spectator = createComponent({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                queryParamMap: {
                  get: jest.fn((key: string) => {
                    if (key === 'org') return 'grupobancolombia-innersource';
                    if (key === 'repo') return 'NU5740001_Metrics_Doc';
                    if (key === 'mode') return 'view';
                    return null;
                  }),
                },
              },
            },
          },
        ],
      });
      spectator.detectChanges();
    });

    it('should disable entire form when in view mode', () => {
      expect(spectator.component.isViewMode()).toBe(true);
      expect(spectator.component.resourceForm.disabled).toBe(true);
    });

    it('should not execute submit in view mode', () => {
      spectator.component.onSubmit();
      expect(mockDocService.createResource).not.toHaveBeenCalled();
      expect(mockDocService.updateResource).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should navigate back to list-documents', () => {
      spectator = createComponent();
      spectator.detectChanges();
      const router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');

      spectator.component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/admin/list-documents']);
    });
  });
});