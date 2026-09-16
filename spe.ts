import { HttpClient } from '@angular/common/http';
import {
  IDocumentsList,
  IRepositories,
  IResponseListDocuments,
  IResponseRepositories,
} from '@core/models/documentation-tree.model';
import { IDocument } from '@core/models/documents.model';
import {
  IDocumentationResource,
  ICreateResourcePayload,
  IUpdateResourcePayload,
} from '@core/models/documentation-resource.model';
import {
  createServiceFactory,
  SpectatorService,
  SpectatorServiceOptions,
} from '@ngneat/spectator/jest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AdapterDocumentationService } from '../adapter/adapter-documentation.service';
import { DocumentationService } from './documentation.service';

jest.mock('@environments/environment', () => ({
  environment: {
    apiBaseUrl: 'https://test-api.example.com/',
  },
}));

describe('DocumentationService', () => {
  let spectator: SpectatorService<DocumentationService>;
  let httpClient: HttpClient;
  let adapterService: AdapterDocumentationService;

  const createService = createServiceFactory({
    service: DocumentationService,
    mocks: [HttpClient, AdapterDocumentationService],
  } as SpectatorServiceOptions<DocumentationService>);

  beforeEach(() => {
    spectator = createService();
    httpClient = spectator.inject(HttpClient);
    adapterService = spectator.inject(AdapterDocumentationService);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('getRepositories', () => {
    const mockRawRepos: IRepositories[] = [
      { organization: 'bancolombia', repository: 'portal-docs' },
      { organization: 'nequi', repository: 'nequi-docs' },
    ];

    const mockTransformedRepos: IResponseRepositories[] = [
      {
        organization: 'bancolombia',
        repository: 'portal-docs',
        expanded: false,
      },
      { organization: 'nequi', repository: 'nequi-docs', expanded: false },
    ];

    it('should call http get with the correct URL', () => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawRepos));
      (adapterService.transformRepositories as jest.Mock).mockReturnValue(
        mockTransformedRepos
      );

      spectator.service.getRepositories().subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories'
      );
    });

    it('should transform raw repositories through adapter', done => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawRepos));
      (adapterService.transformRepositories as jest.Mock).mockReturnValue(
        mockTransformedRepos
      );

      spectator.service.getRepositories().subscribe(result => {
        expect(adapterService.transformRepositories).toHaveBeenCalledWith(
          mockRawRepos
        );
        expect(result).toEqual(mockTransformedRepos);
        done();
      });
    });

    it('should return empty array when no repositories exist', done => {
      httpClient.get = jest.fn().mockReturnValue(of([]));
      (adapterService.transformRepositories as jest.Mock).mockReturnValue([]);

      spectator.service.getRepositories().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('getListDocumentNest', () => {
    const itemToSearch: IRepositories = {
      organization: 'bancolombia',
      repository: 'portal-docs',
    };

    const mockRawDocuments: IDocumentsList = {
      limit: 100,
      offset: 0,
      total: 1,
      node: {
        blob_sha: null,
        has_children: true,
        name: 'docs',
        parent_path: '/',
        path: '/docs',
        short_order: 0,
        type: 'FOLDER',
        url: null,
      },
      children: [
        {
          name: 'file.md',
          name_file: 'file.md',
          path: 'docs/subfolder/file.md',
          type: 'MARKDOWN',
          url: 'https://example.com/file.md',
          content: null,
          children: null,
        },
      ],
    };

    const mockTransformedDocs: IResponseListDocuments = {
      limit: 100,
      offset: 0,
      total: 1,
      results: [
        {
          name: 'file.md',
          path: 'docs/subfolder/file.md',
          type: 'MARKDOWN',
          url: 'https://example.com/file.md',
          children: null,
          expanded: false,
        },
      ],
    };

    it('should call http get with correct URL including path', () => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service
        .getListDocumentNest(itemToSearch, 'docs/subfolder')
        .subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/bancolombia/portal-docs/tree?path=docs/subfolder'
      );
    });

    it('should transform documents through adapter', done => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service
        .getListDocumentNest(itemToSearch, 'docs/subfolder')
        .subscribe(result => {
          expect(adapterService.transformTree).toHaveBeenCalledWith(
            mockRawDocuments
          );
          expect(result).toEqual(mockTransformedDocs);
          done();
        });
    });

    it('should handle different organizations and repositories', () => {
      const item: IRepositories = {
        organization: 'nequi',
        repository: 'nequi-wiki',
      };
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service.getListDocumentNest(item, 'root/path').subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/nequi/nequi-wiki/tree?path=root/path'
      );
    });
  });

  describe('getListDocument', () => {
    const itemToSearch: IRepositories = {
      organization: 'bancolombia',
      repository: 'portal-docs',
    };

    const mockRawDocuments: IDocumentsList = {
      limit: 100,
      offset: 0,
      total: 2,
      node: {
        blob_sha: null,
        has_children: true,
        name: 'root',
        parent_path: null,
        path: '/',
        short_order: 0,
        type: 'FOLDER',
        url: null,
      },
      children: [
        {
          name: 'README.md',
          name_file: 'README.md',
          path: 'README.md',
          type: 'MARKDOWN',
          url: 'https://example.com/README.md',
          content: null,
          children: null,
        },
        {
          name: 'guides',
          name_file: null,
          path: 'guides',
          type: 'FOLDER',
          url: null,
          content: null,
          children: null,
        },
      ],
    };

    const mockTransformedDocs: IResponseListDocuments = {
      limit: 100,
      offset: 0,
      total: 2,
      results: [
        {
          name: 'README.md',
          path: 'README.md',
          type: 'MARKDOWN',
          url: 'https://example.com/README.md',
          children: null,
          expanded: false,
        },
        {
          name: 'guides',
          path: 'guides',
          type: 'FOLDER',
          url: null,
          children: null,
          expanded: false,
        },
      ],
    };

    it('should call http get with correct URL without path param', () => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service.getListDocument(itemToSearch).subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/bancolombia/portal-docs/tree?offset=0&limit=100'
      );
    });

    it('should transform documents through adapter', done => {
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service.getListDocument(itemToSearch).subscribe(result => {
        expect(adapterService.transformTree).toHaveBeenCalledWith(
          mockRawDocuments
        );
        expect(result).toEqual(mockTransformedDocs);
        done();
      });
    });

    it('should handle different organizations and repositories', () => {
      const item: IRepositories = {
        organization: 'bam-org',
        repository: 'bam-internal',
      };
      httpClient.get = jest.fn().mockReturnValue(of(mockRawDocuments));
      (adapterService.transformTree as jest.Mock).mockReturnValue(
        mockTransformedDocs
      );

      spectator.service.getListDocument(item).subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/bam-org/bam-internal/tree?offset=0&limit=100'
      );
    });
  });

  describe('getDocumentation', () => {
    it('should call http get with the correct URL', () => {
      httpClient.get = jest.fn().mockReturnValue(
        of({
          contentBase64: btoa('# Markdown content'),
        })
      );

      spectator.service.getDocumentation('my-org', 'my-repo', 'docs/readme.md');

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/my-org/my-repo/documents?path=docs/readme.md'
      );
    });

    it('should return the documentation content decoded from base64', async () => {
      const mockContent = '# Test Documentation';
      const encoded = btoa(
        String.fromCharCode(...new TextEncoder().encode(mockContent))
      );
      httpClient.get = jest.fn().mockReturnValue(
        of({
          contentBase64: encoded,
        })
      );

      await expect(
        firstValueFrom(
          spectator.service.getDocumentation('my-org', 'my-repo', 'test-doc.md')
        )
      ).resolves.toBe(mockContent);
    });

    it('should handle UTF-8 content correctly', async () => {
      const mockContent = '# Documentación con acentos: ñ, á, é, í, ó, ú';
      const encoded = btoa(
        String.fromCharCode(...new TextEncoder().encode(mockContent))
      );
      httpClient.get = jest
        .fn()
        .mockReturnValue(of({ contentBase64: encoded }));

      await expect(
        firstValueFrom(
          spectator.service.getDocumentation('org', 'repo', 'doc.md')
        )
      ).resolves.toBe(mockContent);
    });

    it('should build URL with different params', () => {
      httpClient.get = jest
        .fn()
        .mockReturnValue(of({ contentBase64: btoa('content') }));

      spectator.service.getDocumentation(
        'nequi-org',
        'nequi-wiki',
        'guides/onboarding.md'
      );

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/repositories/nequi-org/nequi-wiki/documents?path=guides/onboarding.md'
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should call http get with the correct URL', () => {
      httpClient.get = jest.fn().mockReturnValue(of([]));

      spectator.service.getAllDocuments();

      expect(httpClient.get).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/docs'
      );
    });

    it('should return a list of documents', done => {
      const mockDocuments: IDocument[] = [
        {
          id: '1',
          title: 'Doc 1',
          region: 'Bancolombia',
          created: new Date('2025-01-01'),
          modified: new Date('2025-01-02'),
        },
        {
          id: '2',
          title: 'Doc 2',
          region: 'BAM',
          created: new Date('2025-02-01'),
          modified: new Date('2025-02-02'),
        },
      ];
      httpClient.get = jest.fn().mockReturnValue(of(mockDocuments));

      spectator.service.getAllDocuments().subscribe(result => {
        expect(result).toEqual(mockDocuments);
        expect(result.length).toBe(2);
        done();
      });
    });

    it('should return an empty array when no documents exist', done => {
      httpClient.get = jest.fn().mockReturnValue(of([]));

      spectator.service.getAllDocuments().subscribe(result => {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });
    });

    it('should return empty array when the request fails (catchError)', done => {
      httpClient.get = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Server error')));

      spectator.service.getAllDocuments().subscribe({
        next: result => {
          expect(result).toEqual([]);
          done();
        },
      });
    });
  });

  describe('deleteDocument', () => {
    it('should call http delete with the correct URL', () => {
      httpClient.delete = jest.fn().mockReturnValue(of(undefined));

      spectator.service.deleteDocument('doc-123').subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        'https://test-api.example.com/documentation/api/v1/docs/doc-123'
      );
    });

    it('should pass the document id in the URL', () => {
      httpClient.delete = jest.fn().mockReturnValue(of(undefined));

      spectator.service.deleteDocument('abc-456-def').subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('docs/abc-456-def')
      );
    });

    it('should return the delete response', done => {
      const mockResponse = { success: true };
      httpClient.delete = jest.fn().mockReturnValue(of(mockResponse));

      spectator.service.deleteDocument('doc-1').subscribe(result => {
        expect(result).toEqual(mockResponse);
        done();
      });
    });

    it('should propagate errors from the server', done => {
      httpClient.delete = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Delete failed')));

      spectator.service.deleteDocument('doc-1').subscribe({
        error: error => {
          expect(error.message).toBe('Delete failed');
          done();
        },
      });
    });
  });

  describe('Resources CRUD (/resources)', () => {
    const baseUrl = 'https://test-api.example.com/documentation/api/v1/resources';
    const mockResource: IDocumentationResource = {
      organization: 'grupobancolombia-innersource',
      repositoryName: 'NU5740001_Metrics_Doc',
      name: 'Documentación Métricas Corporativas',
      description: 'Documentación portal',
      url: 'https://github.com/grupobancolombia-innersource/NU5740001_Metrics_Doc',
      lastSyncedAt: '2026-09-16T12:00:00Z',
    };

    describe('getResources', () => {
      it('should call http get to the resources endpoint', () => {
        httpClient.get = jest.fn().mockReturnValue(of([mockResource]));

        spectator.service.getResources().subscribe();

        expect(httpClient.get).toHaveBeenCalledWith(baseUrl);
      });

      it('should return list of resources', done => {
        httpClient.get = jest.fn().mockReturnValue(of([mockResource]));

        spectator.service.getResources().subscribe(result => {
          expect(result).toEqual([mockResource]);
          expect(result.length).toBe(1);
          done();
        });
      });

      it('should return empty array when request fails (catchError)', done => {
        httpClient.get = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('Network error')));

        spectator.service.getResources().subscribe({
          next: result => {
            expect(result).toEqual([]);
            done();
          },
        });
      });
    });

    describe('getResourceById', () => {
      it('should call http get with organization and repositoryName in correct order', () => {
        httpClient.get = jest.fn().mockReturnValue(of(mockResource));

        spectator.service
          .getResourceById('grupobancolombia-innersource', 'NU5740001_Metrics_Doc')
          .subscribe();

        expect(httpClient.get).toHaveBeenCalledWith(
          `${baseUrl}/grupobancolombia-innersource/NU5740001_Metrics_Doc`
        );
      });

      it('should return the specific resource', done => {
        httpClient.get = jest.fn().mockReturnValue(of(mockResource));

        spectator.service
          .getResourceById('grupobancolombia-innersource', 'NU5740001_Metrics_Doc')
          .subscribe(result => {
            expect(result).toEqual(mockResource);
            done();
          });
      });
    });

    describe('createResource', () => {
      const payload: ICreateResourcePayload = {
        organization: 'grupobancolombia-innersource',
        repositoryName: 'NU5740001_Metrics_Doc',
        name: 'Documentación Métricas Corporativas',
        description: 'Métricas observabilidad',
        url: 'https://github.com/repo',
      };

      it('should call http post with correct URL and payload', () => {
        httpClient.post = jest.fn().mockReturnValue(of(mockResource));

        spectator.service.createResource(payload).subscribe();

        expect(httpClient.post).toHaveBeenCalledWith(baseUrl, payload);
      });

      it('should return created resource', done => {
        httpClient.post = jest.fn().mockReturnValue(of(mockResource));

        spectator.service.createResource(payload).subscribe(result => {
          expect(result).toEqual(mockResource);
          done();
        });
      });

      it('should propagate error on creation failure', done => {
        httpClient.post = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('Bad Request')));

        spectator.service.createResource(payload).subscribe({
          error: err => {
            expect(err.message).toBe('Bad Request');
            done();
          },
        });
      });
    });

    describe('updateResource', () => {
      const updatePayload: IUpdateResourcePayload = {
        name: 'Nombre actualizado',
        description: 'Nueva descripción',
      };

      it('should call http put with identity in URL and payload in body', () => {
        httpClient.put = jest.fn().mockReturnValue(of(mockResource));

        spectator.service
          .updateResource(
            'grupobancolombia-innersource',
            'NU5740001_Metrics_Doc',
            updatePayload
          )
          .subscribe();

        expect(httpClient.put).toHaveBeenCalledWith(
          `${baseUrl}/grupobancolombia-innersource/NU5740001_Metrics_Doc`,
          updatePayload
        );
      });

      it('should return updated resource', done => {
        const updatedResource = { ...mockResource, ...updatePayload };
        httpClient.put = jest.fn().mockReturnValue(of(updatedResource));

        spectator.service
          .updateResource(
            'grupobancolombia-innersource',
            'NU5740001_Metrics_Doc',
            updatePayload
          )
          .subscribe(result => {
            expect(result).toEqual(updatedResource);
            done();
          });
      });
    });

    describe('deleteResource', () => {
      it('should call http delete with organization and repositoryName in URL', () => {
        httpClient.delete = jest.fn().mockReturnValue(of(undefined));

        spectator.service
          .deleteResource('grupobancolombia-innersource', 'NU5740001_Metrics_Doc')
          .subscribe();

        expect(httpClient.delete).toHaveBeenCalledWith(
          `${baseUrl}/grupobancolombia-innersource/NU5740001_Metrics_Doc`
        );
      });

      it('should propagate delete errors', done => {
        httpClient.delete = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('Resource not found')));

        spectator.service
          .deleteResource('grupobancolombia-innersource', 'NU5740001_Metrics_Doc')
          .subscribe({
            error: err => {
              expect(err.message).toBe('Resource not found');
              done();
            },
          });
      });
    });
  });
});