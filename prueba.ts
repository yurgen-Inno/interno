import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGlobalStoreService: jasmine.SpyObj<GlobalStoreService>;
  let mockSeniorityService: jasmine.SpyObj<SeniorityService>;
  let storeEmailSignal = signal<any>('colaborador@bancolombia.com.co');

  const mockSeniorityResponse: IResponsePersonalSeniority = {
    name: 'Juan Perez',
    email: 'colaborador@bancolombia.com.co',
    seniorityLevel: 'Senior',
    score: 95,
  } as any;

  beforeEach(async () => {
    storeEmailSignal = signal<any>('colaborador@bancolombia.com.co');
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockGlobalStoreService = jasmine.createSpyObj('GlobalStoreService', [
      'selector',
      'removeAction',
    ]);
    mockSeniorityService = jasmine.createSpyObj('SeniorityService', [
      'getPersonalSeniority',
    ]);

    mockGlobalStoreService.selector.and.returnValue(storeEmailSignal);
    mockSeniorityService.getPersonalSeniority.and.returnValue(
      of(mockSeniorityResponse)
    );

    await TestBed.configureTestingModule({
      imports: [AuthorDetailComponent],
      providers: [
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
      spyOn(component.resourcePersonalSeniority, 'reload');
      component.reloadService();
      expect(component.resourcePersonalSeniority.reload).toHaveBeenCalled();
    });
  });
});