import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { MODAL_CONFIRM_DELETE_DOCUMENT } from '@core/constants/table-documents.contant';
import {
  EResourceViewMode,
  IDocumentationResource,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';
import { EEventSelectItem } from '@core/models/table-dashboard.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { GlobalStoreService } from '@shared/store/global-store.service';
import { of } from 'rxjs';
import { ModalComponent } from 'web-components-lib';
import { ListDocumentsComponent } from './list-documents.component';

describe('ListDocumentsComponent', () => {
  let spectator: Spectator<ListDocumentsComponent>;

  const mockResource: IDocumentationResource = {
    organization: 'grupobancolombia-innersource',
    repositoryName: 'NU5740001_Metrics_Doc',
    name: 'Documentación Métricas',
    description: 'Desc',
    url: 'https://github.com/repo',
    lastSyncedAt: '2026-09-16T12:00:00Z',
  };

  const mockRow: IRowDocument = {
    id: 'grupobancolombia-innersource/NU5740001_Metrics_Doc',
    title: 'Documentación Métricas',
    region: 'grupobancolombia-innersource',
    created: new Date('2026-09-16T12:00:00Z'),
    modified: new Date('2026-09-16T12:00:00Z'),
    organization: 'grupobancolombia-innersource',
    repositoryName: 'NU5740001_Metrics_Doc',
    name: 'Documentación Métricas',
    description: 'Desc',
    url: 'https://github.com/repo',
    lastSyncedAt: '2026-09-16T12:00:00Z',
  };

  const mockDocumentationService = {
    getResources: jest.fn().mockReturnValue(of([mockResource])),
    deleteResource: jest.fn().mockReturnValue(of(null)),
  };

  const mockEventsService = {
    sendEvent: jest.fn().mockReturnValue(of(null)),
  };

  const mockGlobalStoreService = {
    selector: jest.fn().mockReturnValue(signal([])),
  };

  const createComponent = createRoutingFactory({
    component: ListDocumentsComponent,
    shallow: true,
    providers: [
      { provide: DocumentationService, useValue: mockDocumentationService },
      { provide: EventsService, useValue: mockEventsService },
      { provide: GlobalStoreService, useValue: mockGlobalStoreService },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDocumentationService.getResources.mockReturnValue(of([mockResource]));
    mockDocumentationService.deleteResource.mockReturnValue(of(null));
    mockEventsService.sendEvent.mockReturnValue(of(null));
    spectator = createComponent();
  });

  describe('initialization', () => {
    it('should create the component', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default modal information configured', () => {
      const modalInfo = spectator.component.$modalInformation();
      expect(modalInfo).toEqual(MODAL_CONFIRM_DELETE_DOCUMENT);
    });

    it('should initialize $documentToDelete as null', () => {
      expect(spectator.component.$documentToDelete()).toBeNull();
    });
  });

  describe('goBack', () => {
    it('should navigate to /dashboard', () => {
      const router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');

      spectator.component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('goToCreateNewDocument', () => {
    it('should navigate to /admin/create-document', () => {
      const router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');

      spectator.component.goToCreateNewDocument();

      expect(router.navigate).toHaveBeenCalledWith(['/admin/create-document']);
    });
  });

  describe('onTableOptionSelect', () => {
    let router: Router;

    beforeEach(() => {
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigate');
    });

    it('should show modal for delete action (OPT2)', () => {
      const mockModal = { showModal: jest.fn() } as unknown as ModalComponent;
      Object.defineProperty(spectator.component, 'modal', {
        value: () => mockModal,
      });

      const eventPayload: ITableDocuments = {
        option: {
          optionSeleted: EEventSelectItem.OPT2,
          rowData: mockRow,
        },
        row: mockRow,
      };

      spectator.component.onTableOptionSelect(eventPayload);

      expect(spectator.component.$documentToDelete()).toEqual({
        organization: mockRow.organization,
        repositoryName: mockRow.repositoryName,
        name: mockRow.name,
        description: mockRow.description,
        url: mockRow.url,
        lastSyncedAt: mockRow.lastSyncedAt,
      });
      expect(mockModal.showModal).toHaveBeenCalled();
    });

    it('should navigate to view mode for view action (OPT1)', () => {
      const eventPayload: ITableDocuments = {
        option: {
          optionSeleted: EEventSelectItem.OPT1,
          rowData: mockRow,
        },
        row: mockRow,
      };

      spectator.component.onTableOptionSelect(eventPayload);

      expect(router.navigate).toHaveBeenCalledWith(['/admin/create-document'], {
        queryParams: {
          org: mockRow.organization,
          repo: mockRow.repositoryName,
          mode: EResourceViewMode.VIEW,
        },
      });
    });

    it('should navigate to edit mode for edit action (OPT3)', () => {
      const eventPayload: ITableDocuments = {
        option: {
          optionSeleted: EEventSelectItem.OPT3,
          rowData: mockRow,
        },
        row: mockRow,
      };

      spectator.component.onTableOptionSelect(eventPayload);

      expect(router.navigate).toHaveBeenCalledWith(['/admin/create-document'], {
        queryParams: {
          org: mockRow.organization,
          repo: mockRow.repositoryName,
          mode: EResourceViewMode.EDIT,
        },
      });
    });
  });

  describe('handleModalAction', () => {
    it('should call deleteResource when action is accept and documentToDelete exists', () => {
      spectator.component.$documentToDelete.set(mockResource);
      const reloadSpy = jest.spyOn(spectator.component.resourceDocuments, 'reload');

      const mockModal = {
        showModal: jest.fn(),
        handleClose: jest.fn(),
      } as unknown as ModalComponent;

      Object.defineProperty(spectator.component, 'modal', {
        value: () => mockModal,
      });

      spectator.component.handleModalAction('accept');

      expect(mockDocumentationService.deleteResource).toHaveBeenCalledWith(
        mockResource.organization,
        mockResource.repositoryName
      );
      expect(reloadSpy).toHaveBeenCalled();
      expect(mockModal.handleClose).toHaveBeenCalledWith('button-accept');
    });

    it('should not call deleteResource when action is cancel', () => {
      spectator.component.$documentToDelete.set(mockResource);
      const mockModal = {
        showModal: jest.fn(),
        handleClose: jest.fn(),
      } as unknown as ModalComponent;

      Object.defineProperty(spectator.component, 'modal', {
        value: () => mockModal,
      });

      spectator.component.handleModalAction('cancel');

      expect(mockDocumentationService.deleteResource).not.toHaveBeenCalled();
      expect(mockModal.handleClose).toHaveBeenCalledWith('button-cancel');
    });
  });

  describe('documentsViewModels (computed)', () => {
    it('should map resources to table view models with formatted date', () => {
      const result = spectator.component.$documentsViewModels();

      expect(result.length).toBe(1);
      expect(result[0].repositoryName).toBe(mockResource.repositoryName);
      expect(result[0].organization).toBe(mockResource.organization);
      expect(result[0].lastSyncedAtFormatted).toBeDefined();
    });
  });
});