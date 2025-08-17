import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { LoginRequest, AuthResult, AuthError, User, UserRole } from '../models/auth.models';
import { MockAuthDatabase } from '../data/mock-users.data';

describe('AuthService - Web.Desktop', () => {
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
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas de barbeiro', (done) => {
      const loginRequest: LoginRequest = {
        email: 'barbeiro@barbearia.com',
        password: 'Barbeiro123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.user?.email).toBe('barbeiro@barbearia.com');
          expect(result.user?.role).toBe(UserRole.BARBEIRO);
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

    it('deve falhar com credenciais inválidas', (done) => {
      const loginRequest: LoginRequest = {
        email: 'barbeiro@barbearia.com',
        password: 'senhaerrada'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.INVALID_CREDENTIALS);
          expect(result.message).toBe('Credenciais inválidas');
          expect(result.user).toBeUndefined();
          expect(result.token).toBeUndefined();
          done();
        },
        error: () => {
          fail('Login deveria retornar resultado de falha, não erro');
          done();
        }
      });
    });

    it('deve falhar com usuário não encontrado', (done) => {
      const loginRequest: LoginRequest = {
        email: 'naoexiste@email.com',
        password: 'qualquersenha'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.USER_NOT_FOUND);
          expect(result.message).toBe('Usuário não encontrado');
          done();
        },
        error: () => {
          fail('Login deveria retornar resultado de falha, não erro');
          done();
        }
      });
    });

    it('deve armazenar token no localStorage após login bem-sucedido', (done) => {
      const loginRequest: LoginRequest = {
        email: 'barbeiro@barbearia.com',
        password: 'Barbeiro123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(localStorage.setItem).toHaveBeenCalledWith('barbearia_desktop_token', jasmine.any(String));
          expect(localStorage.setItem).toHaveBeenCalledWith('barbearia_desktop_user', jasmine.any(String));
          done();
        },
        error: () => {
          fail('Login não deveria falhar');
          done();
        }
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Simular usuário logado
      mockLocalStorage['barbearia_desktop_token'] = 'fake-token';
      mockLocalStorage['barbearia_desktop_user'] = JSON.stringify({
        id: 'barbeiro-001',
        email: 'barbeiro@barbearia.com',
        name: 'João Silva',
        role: UserRole.BARBEIRO
      });
    });

    it('deve fazer logout e limpar localStorage', (done) => {
      service.logout().subscribe({
        next: (success: boolean) => {
          expect(success).toBe(true);
          expect(localStorage.removeItem).toHaveBeenCalledWith('barbearia_desktop_token');
          expect(localStorage.removeItem).toHaveBeenCalledWith('barbearia_desktop_user');
          done();
        },
        error: () => {
          fail('Logout não deveria falhar');
          done();
        }
      });
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando usuário está autenticado', (done) => {
      mockLocalStorage['barbearia_desktop_token'] = 'valid-token';
      mockLocalStorage['barbearia_desktop_user'] = JSON.stringify({
        id: 'barbeiro-001',
        email: 'barbeiro@barbearia.com',
        name: 'João Silva',
        role: UserRole.BARBEIRO
      });

      service.isAuthenticated().subscribe({
        next: (isAuth: boolean) => {
          expect(isAuth).toBe(true);
          done();
        }
      });
    });

    it('deve retornar false quando usuário não está autenticado', (done) => {
      service.isAuthenticated().subscribe({
        next: (isAuth: boolean) => {
          expect(isAuth).toBe(false);
          done();
        }
      });
    });

    it('deve retornar false quando token expirou', (done) => {
      // Simular token expirado (mais de 1 hora atrás)
      const expiredTime = Date.now() - (2 * 60 * 60 * 1000); // 2 horas atrás
      mockLocalStorage['barbearia_desktop_token'] = 'expired-token';
      mockLocalStorage['barbearia_desktop_token_time'] = expiredTime.toString();

      service.isAuthenticated().subscribe({
        next: (isAuth: boolean) => {
          expect(isAuth).toBe(false);
          done();
        }
      });
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar usuário atual quando autenticado', (done) => {
      const mockUser = {
        id: 'barbeiro-001',
        email: 'barbeiro@barbearia.com',
        name: 'João Silva',
        role: UserRole.BARBEIRO,
        tenantId: 'tenant-001'
      };

      mockLocalStorage['barbearia_desktop_token'] = 'valid-token';
      mockLocalStorage['barbearia_desktop_user'] = JSON.stringify(mockUser);

      service.getCurrentUser().subscribe({
        next: (user: User | null) => {
          expect(user).toEqual(mockUser);
          done();
        }
      });
    });

    it('deve retornar null quando não autenticado', (done) => {
      service.getCurrentUser().subscribe({
        next: (user: User | null) => {
          expect(user).toBeNull();
          done();
        }
      });
    });
  });

  describe('refreshToken', () => {
    it('deve renovar token válido', (done) => {
      mockLocalStorage['barbearia_desktop_token'] = 'valid-token';
      mockLocalStorage['barbearia_desktop_user'] = JSON.stringify({
        id: 'barbeiro-001',
        email: 'barbeiro@barbearia.com',
        name: 'João Silva',
        role: UserRole.BARBEIRO
      });

      service.refreshToken().subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.token).toBeTruthy();
          expect(result.message).toBe('Token renovado com sucesso');
          done();
        },
        error: () => {
          fail('Refresh token não deveria falhar com token válido');
          done();
        }
      });
    });

    it('deve falhar ao renovar token inválido', (done) => {
      service.refreshToken().subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(false);
          expect(result.error).toBe(AuthError.INVALID_TOKEN);
          expect(result.message).toBe('Token inválido ou expirado');
          done();
        },
        error: () => {
          fail('Refresh token deveria retornar resultado de falha, não erro');
          done();
        }
      });
    });
  });

  describe('Validação de mensagens em português', () => {
    it('deve retornar mensagens de erro em português', (done) => {
      const loginRequest: LoginRequest = {
        email: 'barbeiro@barbearia.com',
        password: 'senhaerrada'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.message).toBe('Credenciais inválidas');
          expect(result.message).not.toContain('Invalid');
          expect(result.message).not.toContain('Error');
          done();
        }
      });
    });

    it('deve retornar mensagem de sucesso em português', (done) => {
      const loginRequest: LoginRequest = {
        email: 'barbeiro@barbearia.com',
        password: 'Barbeiro123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.message).toBe('Login realizado com sucesso');
          expect(result.message).not.toContain('Success');
          expect(result.message).not.toContain('Login successful');
          done();
        }
      });
    });
  });

  describe('Cenários de edge cases', () => {
    it('deve lidar com localStorage indisponível', () => {
      spyOn(localStorage, 'getItem').and.throwError('LocalStorage não disponível');
      
      expect(() => service.isAuthenticated()).not.toThrow();
    });

    it('deve lidar com JSON inválido no localStorage', (done) => {
      mockLocalStorage['barbearia_desktop_user'] = 'json-invalido';
      mockLocalStorage['barbearia_desktop_token'] = 'valid-token';

      service.getCurrentUser().subscribe({
        next: (user: User | null) => {
          expect(user).toBeNull();
          done();
        }
      });
    });

    it('deve lidar com email em maiúsculas', (done) => {
      const loginRequest: LoginRequest = {
        email: 'BARBEIRO@BARBEARIA.COM',
        password: 'Barbeiro123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          expect(result.user?.email).toBe('barbeiro@barbearia.com');
          done();
        }
      });
    });

    it('deve lidar com espaços em branco no email', (done) => {
      const loginRequest: LoginRequest = {
        email: '  barbeiro@barbearia.com  ',
        password: 'Barbeiro123!'
      };

      service.login(loginRequest).subscribe({
        next: (result: AuthResult) => {
          expect(result.success).toBe(true);
          done();
        }
      });
    });
  });
});