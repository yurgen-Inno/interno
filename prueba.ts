describe('viewProjects', () => {
  it('should persist the developer email and navigate to the projects route', () => {
    const router = spectator.inject(Router);
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    spectator.component.viewProjects('dev@bank.com');

    expect(createAction).toHaveBeenCalledWith(
      expect.any(String),
      'dev@bank.com',
      true
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/seniority/author-detail']);
  });

  it('should not persist or navigate if email is falsy', () => {
    const router = spectator.inject(Router);
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    spectator.component.viewProjects(undefined);

    expect(createAction).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router'; // <-- Añade provideRouter
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthorDetailComponent } from './author-detail.component';
import { SeniorityService } from '../../services/seniority.service';
import { GlobalStoreService } from '@shared/services/global-store.service';
import { SELECTOR_STORE_EMAIL_SENIORITY } from '../../constants/seniority.constants';
import { IResponsePersonalSeniority } from '../../models/personal-seniority.interface';

describe('AuthorDetailComponent', () => {
  let component: AuthorDetailComponent;
  let fixture: ComponentFixture<AuthorDetailComponent>;
  let mockRouter: { navigate: jest.Mock };
  let mockGlobalStoreService: { selector: jest.Mock; removeAction: jest.Mock };
  let mockSeniorityService: { getPersonalSeniority: jest.Mock };
  let storeEmailSignal = signal<any>('colaborador@bancolombia.com.co');

  const mockSeniorityResponse: IResponsePersonalSeniority = {
    name: 'Juan Perez',
    email: 'colaborador@bancolombia.com.co',
    seniorityLevel: 'Senior',
    score: 95,
  } as any;

  beforeEach(async () => {
    storeEmailSignal = signal<any>('colaborador@bancolombia.com.co');

    mockRouter = {
      navigate: jest.fn(),
    };

    mockGlobalStoreService = {
      selector: jest.fn().mockReturnValue(storeEmailSignal),
      removeAction: jest.fn(),
    };

    mockSeniorityService = {
      getPersonalSeniority: jest.fn().mockReturnValue(of(mockSeniorityResponse)),
    };

    await TestBed.configureTestingModule({
      imports: [AuthorDetailComponent],
      providers: [
        provideRouter([]), // <-- Provee ActivatedRoute y dependencias de routerLink
        { provide: Router, useValue: mockRouter },
        { provide: GlobalStoreService, useValue: mockGlobalStoreService },
        { provide: SeniorityService, useValue: mockSeniorityService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Signal $email', () => {
    it('debe leer el correo del store correctamente', () => {
      expect(component.$email()).toBe('colaborador@bancolombia.com.co');
    });

    it('debe retornar string vacío si el store devuelve null o no es string', () => {
      storeEmailSignal.set(null);
      fixture.detectChanges();
      expect(component.$email()).toBe('');

      storeEmailSignal.set(12345);
      fixture.detectChanges();
      expect(component.$email()).toBe('');
    });
  });

  describe('goToBack', () => {
    it('debe limpiar el selector en el store y navegar hacia /seniority', () => {
      component.goToBack();

      expect(mockGlobalStoreService.removeAction).toHaveBeenCalledWith(
        SELECTOR_STORE_EMAIL_SENIORITY
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/seniority']);
    });
  });

  describe('reloadService', () => {
    it('debe recargar el rxResource al invocarse', () => {
      const reloadSpy = jest.spyOn(component.resourcePersonalSeniority, 'reload');
      component.reloadService();
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});