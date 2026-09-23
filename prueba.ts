import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthorDetailComponent } from './author-detail.component';
import { GlobalStoreService } from '@shared/store/global-store.service';
import { SeniorityService } from '@core/services/seniority/service/seniority.service';
import { SELECTOR_STORE_EMAIL_SENIORITY } from '@core/constants/seniority.constant';

describe('AuthorDetailComponent', () => {
  let component: AuthorDetailComponent;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockGlobalStoreService: {
    selector: jest.Mock;
    removeAction: jest.Mock;
  };
  let mockSeniorityService: {
    getPersonalSeniority: jest.Mock;
  };

  // Signal simulado para controlar el valor devuelto por el store
  let emailStoreSignal: ReturnType<typeof signal<any>>;

  beforeEach(async () => {
    emailStoreSignal = signal<any>('test@example.com');

    mockRouter = {
      navigate: jest.fn()
    };

    mockGlobalStoreService = {
      selector: jest.fn().mockImplementation((key: string) => {
        if (key === SELECTOR_STORE_EMAIL_SENIORITY) {
          return emailStoreSignal;
        }
        return signal(null);
      }),
      removeAction: jest.fn()
    };

    mockSeniorityService = {
      getPersonalSeniority: jest.fn().mockReturnValue(of({ id: 1, name: 'Senior Dev' }))
    };

    await TestBed.configureTestingModule({
      imports: [AuthorDetailComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GlobalStoreService, useValue: mockGlobalStoreService },
        { provide: SeniorityService, useValue: mockSeniorityService }
      ]
    })
    .overrideComponent(AuthorDetailComponent, {
      set: { template: '', imports: [] } // Evita renderizar componentes hijos en tests unitarios
    })
    .compileComponents();

    const fixture = TestBed.createComponent(AuthorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('computed: $email', () => {
    it('debe retornar el email limpio si es un string válido con espacios', () => {
      emailStoreSignal.set('  user@domain.com  ');
      TestBed.flushEffects();

      expect(component.$email()).toBe('  user@domain.com  ');
    });

    it('debe retornar string vacío si el valor es solo espacios en blanco', () => {
      emailStoreSignal.set('    ');
      TestBed.flushEffects();

      expect(component.$email()).toBe('');
    });

    it('debe retornar string vacío si el valor no es un string (null, undefined, etc.)', () => {
      emailStoreSignal.set(null);
      TestBed.flushEffects();

      expect(component.$email()).toBe('');
    });
  });

  describe('resourcePersonalSeniority', () => {
    it('debe llamar al servicio seniority cuando el email es válido', () => {
      emailStoreSignal.set('dev@test.com');
      TestBed.flushEffects();

      expect(mockSeniorityService.getPersonalSeniority).toHaveBeenCalledWith('dev@test.com');
    });

    it('no debe llamar al servicio si el email está vacío', () => {
      mockSeniorityService.getPersonalSeniority.mockClear();
      emailStoreSignal.set('');
      TestBed.flushEffects();

      expect(mockSeniorityService.getPersonalSeniority).not.toHaveBeenCalled();
    });
  });

  describe('reloadService()', () => {
    it('debe invocar reload() en resourcePersonalSeniority', () => {
      const reloadSpy = jest.spyOn(component.resourcePersonalSeniority, 'reload');

      component.reloadService();

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('goToBack()', () => {
    it('debe remover el email del store y navegar hacia /seniority con el queryParam tab="ranking"', () => {
      component.goToBack();

      expect(mockGlobalStoreService.removeAction).toHaveBeenCalledWith(
        SELECTOR_STORE_EMAIL_SENIORITY
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/seniority'], {
        queryParams: { tab: 'ranking' }
      });
    });
  });
});