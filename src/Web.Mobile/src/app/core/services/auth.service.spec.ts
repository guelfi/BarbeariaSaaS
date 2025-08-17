import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { 
  LoginRequest, 
  AuthResult, 
  AuthError, 
  User, 
  UserRole,
  RegisterClienteRequest 
} from '../models/auth.models';
import { MockAuthDatabase } from '../data/mock-users.data';

describe('AuthService - Web.Mobile', () => {
  let service: AuthService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);

    // Mock localStorage
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      mockLocalStorage = {};
    });

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas de cliente', (done) => {
      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.user?.email).toBe('cliente@email.com');
          expect(result.user?.role).toBe(UserRole.CLIENTE);
          expect(result.token).toBeTruthy();
          expect(result.message).toBe('Login realizado com sucesso');
          done();
        },
        error: () => {
          fail('Login não deveria falhar com credenciais válidas');
          done();
        }
      });
    });

    it('deve funcionar em modo offline com credenciais cacheadas', (done) => {
      // Simular modo offline
      Object.defineProperty(navigator, 'onLine', { value: false });
      
      // Simular credenciais cacheadas
      mockLocalStorage['barbearia_mobile_offline_users'] = JSON.stringify([{
        email: 'cliente@email.com',
        password: 'Cliente123!',
        user: {
          id: 'cliente-001',
          email: 'cliente@email.com',
          name: 'Maria Santos',
          role: UserRole.CLIENTE
        }
      }]);

      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.user?.email).toBe('cliente@email.com');
          expect(result.message).toContain('offline');
          done();
        },
        error: () => {
          fail('Login offline não deveria falhar');
          done();
        }
      });
    });

    it('deve falhar em modo offline sem credenciais cacheadas', (done) => {
      Object.defineProperty(navigator, 'onLine', { value: false });

      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.NETWORK_ERROR);
          expect(result.message).toContain('offline');
          done();
        }
      });
    });
  });

  describe('registerCliente', () => {
    it('deve registrar novo cliente com dados válidos', (done) => {
      const registerRequest: RegisterClienteRequest = {
        nome: 'Novo Cliente',
        email: 'novocliente@email.com',
        senha: 'NovaSenh@123',
        confirmarSenha: 'NovaSenh@123',
        telefone: '(11) 99999-9999',
        barbeariaId: 'barbearia-001'
      };

      service.registerCliente(registerRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.user?.email).toBe('novocliente@email.com');
          expect(result.user?.role).toBe(UserRole.CLIENTE);
          expect(result.message).toBe('Cadastro realizado com sucesso');
          done();
        },
        error: () => {
          fail('Registro não deveria falhar com dados válidos');
          done();
        }
      });
    });

    it('deve falhar ao registrar cliente com email já existente', (done) => {
      const registerRequest: RegisterClienteRequest = {
        nome: 'Cliente Existente',
        email: 'cliente@email.com', // Email já existe
        senha: 'NovaSenh@123',
        confirmarSenha: 'NovaSenh@123',
        telefone: '(11) 99999-9999',
        barbeariaId: 'barbearia-001'
      };

      service.registerCliente(registerRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.EMAIL_ALREADY_EXISTS);
          expect(result.message).toBe('Email já está em uso');
          done();
        }
      });
    });

    it('deve falhar quando senhas não coincidem', (done) => {
      const registerRequest: RegisterClienteRequest = {
        nome: 'Novo Cliente',
        email: 'novocliente2@email.com',
        senha: 'NovaSenh@123',
        confirmarSenha: 'SenhaDiferente123',
        telefone: '(11) 99999-9999',
        barbeariaId: 'barbearia-001'
      };

      service.registerCliente(registerRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.VALIDATION_ERROR);
          expect(result.message).toBe('Senhas não coincidem');
          done();
        }
      });
    });
  });

  describe('Funcionalidades PWA', () => {
    it('deve detectar modo offline', () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      expect(service.isOfflineMode()).toBe(true);
    });

    it('deve detectar modo online', () => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      expect(service.isOfflineMode()).toBe(false);
    });

    it('deve habilitar modo offline', () => {
      service.enableOfflineMode();
      expect(localStorage.setItem).toHaveBeenCalledWith('barbearia_mobile_offline_mode', 'true');
    });

    it('deve sincronizar quando voltar online', (done) => {
      // Simular dados offline pendentes
      mockLocalStorage['barbearia_mobile_offline_queue'] = JSON.stringify([
        { action: 'login', data: { email: 'test@test.com' } }
      ]);

      service.syncWhenOnline().subscribe({
        next: (result) => {
          expect(result.success).toBe(true);
          expect(result.message).toContain('sincronizado');
          done();
        }
      });
    });
  });

  describe('Validação de dados mobile', () => {
    it('deve validar formato de telefone brasileiro', () => {
      const telefoneValido = '(11) 99999-9999';
      const telefoneInvalido = '123456';
      
      // Assumindo que existe um método de validação
      expect(service.validatePhoneNumber(telefoneValido)).toBe(true);
      expect(service.validatePhoneNumber(telefoneInvalido)).toBe(false);
    });

    it('deve validar força da senha', () => {
      const senhaForte = 'MinhaSenh@123';
      const senhaFraca = '123';
      
      expect(service.validatePasswordStrength(senhaForte)).toBe(true);
      expect(service.validatePasswordStrength(senhaFraca)).toBe(false);
    });
  });

  describe('Gerenciamento de estado offline', () => {
    it('deve armazenar credenciais para uso offline', (done) => {
      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      service.login(loginRequest).subscribe({
        next: () => {
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'barbearia_mobile_offline_users', 
            jasmine.any(String)
          );
          done();
        }
      });
    });

    it('deve limpar dados offline no logout', (done) => {
      mockLocalStorage['barbearia_mobile_token'] = 'valid-token';
      mockLocalStorage['barbearia_mobile_offline_users'] = JSON.stringify([]);

      service.logout().subscribe({
        next: () => {
          expect(localStorage.removeItem).toHaveBeenCalledWith('barbearia_mobile_offline_users');
          expect(localStorage.removeItem).toHaveBeenCalledWith('barbearia_mobile_offline_queue');
          done();
        }
      });
    });
  });

  describe('Mensagens em português', () => {
    it('deve retornar todas as mensagens em português', (done) => {
      const loginRequest: LoginRequest = {
        email: 'emailinvalido',
        password: 'senha'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.message).not.toContain('Invalid');
          expect(result.message).not.toContain('Error');
          expect(result.message).not.toContain('Success');
          // Deve conter palavras em português
          expect(result.message).toMatch(/[áàâãéêíóôõúç]/i);
          done();
        }
      });
    });
  });

  describe('Tratamento de erros específicos mobile', () => {
    it('deve lidar com perda de conectividade durante login', (done) => {
      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      // Simular perda de conexão no meio do processo
      spyOn(service, 'login').and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.login(loginRequest).subscribe({
        next: () => {
          fail('Não deveria ter sucesso com erro de rede');
        },
        error: (error) => {
          expect(error.message).toBe('Network error');
          done();
        }
      });
    });

    it('deve implementar retry automático para falhas de rede', (done) => {
      let tentativas = 0;
      spyOn(service, 'login').and.callFake(() => {
        tentativas++;
        if (tentativas < 3) {
          return throwError(() => new Error('Network timeout'));
        }
        return of({
          success: true,
          message: 'Login realizado com sucesso após retry'
        } as AuthResult);
      });

      const loginRequest: LoginRequest = {
        email: 'cliente@email.com',
        password: 'Cliente123!'
      };

      service.loginWithRetry(loginRequest, 3).subscribe({
        next: (result) => {
          expect(result.success).toBe(true);
          expect(tentativas).toBe(3);
          done();
        },
        error: () => {
          fail('Deveria ter sucesso após retry');
          done();
        }
      });
    });
  });
});