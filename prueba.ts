import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { ListProjectsComponent } from './list-projects.component';
import { SeniorityService } from './seniority.service';
import { RoleService } from './role.service';
import { GlobalStoreService } from './global-store.service';
import { IResponseDeveloperProjects, Project } from './projects.interface';

// 1. Mock adaptado a la estructura de IResponseDeveloperProjects
const mockDeveloperProjects: IResponseDeveloperProjects = {
  count: 2,
  page: 0,
  size: 15,
  data: [
    {
      applicationCode: 'APP-1',
      authorEmail: 'user@bancolombia.com.co',
      deltaScoreProject: 0,
      directionScoreProject: 'up',
      filial: 'CO',
      levelPreviousProject: 'Senior',
      levelProject: 'Senior',
      scorePreviousProject: 80,
      scoreProject: 85,
      subIndicadores: {} as any
    },
    {
      applicationCode: 'APP-2',
      authorEmail: 'user@bancolombia.com.co',
      deltaScoreProject: 0,
      directionScoreProject: 'up',
      filial: 'CO',
      levelPreviousProject: 'Mid',
      levelProject: 'Senior',
      scorePreviousProject: 70,
      scoreProject: 75,
      subIndicadores: {} as any
    }
  ]
};

// 2. Resultado esperado mapeado a Project[]
const mockMappedProjects: Project[] = [
  {
    applicationCode: 'APP-1',
    levelProject: 'Senior',
    scoreProject: 85,
    projectTime: '5 Meses'
  },
  {
    applicationCode: 'APP-2',
    levelProject: 'Senior',
    scoreProject: 75,
    projectTime: '5 Meses'
  }
];

describe('ListProjectsComponent', () => {
  let spectator: Spectator<ListProjectsComponent>;

  const currentUser = signal<{ email: string } | null>({
    email: 'user@bancolombia.com.co'
  });

  // Spy apuntando al nombre real del método usado en el componente: getAllDeveloperProjects
  const getAllDeveloperProjects = jest.fn().mockReturnValue(of(mockDeveloperProjects));
  const selector = jest.fn().mockReturnValue(signal('dev@bank.com'));

  const createComponent = createComponentFactory({
    component: ListProjectsComponent,
    providers: [
      mockProvider(SeniorityService, { getAllDeveloperProjects }),
      mockProvider(RoleService, {
        currentUser: currentUser as unknown as RoleService['currentUser']
      }),
      mockProvider(GlobalStoreService, { selector })
    ],
    overrideComponents: [
      [
        ListProjectsComponent,
        {
          remove: {
            imports: [
              // Módulos que se omiten en la vista aislada
            ]
          },
          add: { imports: [] }
        }
      ]
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    detectChanges: false
  });

  beforeEach(() => {
    currentUser.set({ email: 'user@bancolombia.com.co' });
    getAllDeveloperProjects.mockClear().mockReturnValue(of(mockDeveloperProjects));
    selector.mockReturnValue(signal('dev@bank.com'));
    spectator = createComponent();
  });

  // Tests estructurales / signals base
  it('should have skeleton configuration initialized', () => {
    expect(spectator.component.skeletonColumns).toHaveLength(3);
    expect(spectator.component.skeletonRows).toHaveLength(6);
    expect(spectator.component.$cellOptions().length).toBeGreaterThan(0);
  });

  it('should read the developer email from the store', () => {
    expect(spectator.component.$emailDeveloper()).toBe('dev@bank.com');
  });

  describe('resourceGetAllTabs', () => {
    it('should call the service with the current user email, developer email and filters', () => {
      spectator.detectChanges();

      expect(getAllDeveloperProjects).toHaveBeenCalledWith(
        'user@bancolombia.com.co',
        expect.objectContaining({
          page: 0,
          limit: 15,
          emailDeveloper: 'dev@bank.com'
        })
      );
    });

    it('should expose the mapped results through $data', fakeAsync(() => {
      spectator.detectChanges();
      tick();
      spectator.detectChanges();

      expect(spectator.component.$data()).toEqual(mockMappedProjects);
    }));

    it('should not call the service when there is no email - edge case', () => {
      currentUser.set(null);
      getAllDeveloperProjects.mockClear();

      const local = createComponent();

      expect(local.component.resourceGetAllTabs.status()).toBeDefined();
      expect(getAllDeveloperProjects).not.toHaveBeenCalled();
    });

    it('should return an empty array from $data when there are no results', () => {
      getAllDeveloperProjects.mockReturnValue(of({ data: [] } as unknown as IResponseDeveloperProjects));

      const local = createComponent();
      local.detectChanges();

      expect(local.component.$data()).toEqual([]);
    });
  });

  describe('onChangePage', () => {
    it('should update filters and re-query the service', () => {
      spectator.detectChanges();
      getAllDeveloperProjects.mockClear();

      spectator.component.onChangePage({ itemsPerPage: 25, currentPage: 2 });
      spectator.detectChanges();

      expect(getAllDeveloperProjects).toHaveBeenCalledWith(
        'user@bancolombia.com.co',
        expect.objectContaining({
          page: 2,
          limit: 25,
          emailDeveloper: 'dev@bank.com'
        })
      );
    });
  });
});