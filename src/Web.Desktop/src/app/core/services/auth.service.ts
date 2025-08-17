import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { IAuthService } from '../interfaces/auth.interface';
import { 
  LoginRequest, 
  AuthResult, 
  AuthState, 
  User, 
  AuthError,
  RegisterBarbeariaRequest,
  UserRole
} from '../models/auth.models';
import { MockAuthDatabase } from '../data/mock-users.data';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private readonly TOKEN_KEY = 'barbearia_token';
  private readonly REFRESH_TOKEN_KEY = 'barbearia_refresh_token';
  private readonly USER_KEY = 'barbearia_user';
  private readonly TOKEN_EXPIRY_KEY = 'barbearia_token_expiry';
  
  private readonly TOKEN_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null
  });

  constructor() {
    this.initializeAuthState();
    this.startTokenExpiryCheck();
  }

  login(credentials: LoginRequest): Observable<AuthResult> {
    // Simulate API delay
    return timer(1000).pipe(
      map(() => {
        const user = MockAuthDatabase.validateCredentials(credentials.email, credentials.password);
        
        if (!user) {
          return {
            success: false,
            error: AuthError.INVALID_CREDENTIALS,
            message: 'Email ou senha inválidos'
          };
        }

        // Only allow barbeiros and recepcionistas in desktop app
        if (user.role !== UserRole.BARBEIRO && user.role !== UserRole.RECEPCIONISTA) {
          return {
            success: false,
            error: AuthError.INVALID_CREDENTIALS,
            message: 'Acesso não autorizado para este tipo de usuário'
          };
        }

        const token = this.generateMockToken(user);
        const refreshToken = this.generateMockRefreshToken(user);
        const tokenExpiry = new Date(Date.now() + this.TOKEN_DURATION);

        this.setToken(token, refreshToken);
        this.setUser(user);
        this.setTokenExpiry(tokenExpiry);

        const authState: AuthState = {
          isAuthenticated: true,
          user,
          token,
          refreshToken,
          tokenExpiry
        };

        this.authStateSubject.next(authState);

        return {
          success: true,
          user,
          token,
          refreshToken,
          message: 'Login realizado com sucesso'
        };
      }),
      catchError(error => {
        return of({
          success: false,
          error: AuthError.UNKNOWN_ERROR,
          message: 'Erro interno do servidor'
        });
      })
    );
  }

  logout(): Observable<boolean> {
    return timer(500).pipe(
      tap(() => {
        this.clearTokens();
        this.authStateSubject.next({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiry: null
        });
      }),
      map(() => true)
    );
  }

  refreshToken(): Observable<AuthResult> {
    const currentRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!currentRefreshToken) {
      return throwError(() => ({
        success: false,
        error: AuthError.TOKEN_EXPIRED,
        message: 'Token de refresh não encontrado'
      }));
    }

    return timer(500).pipe(
      map(() => {
        const currentUser = this.getCurrentUserFromStorage();
        
        if (!currentUser) {
          throw new Error('Usuário não encontrado');
        }

        const newToken = this.generateMockToken(currentUser);
        const newRefreshToken = this.generateMockRefreshToken(currentUser);
        const tokenExpiry = new Date(Date.now() + this.TOKEN_DURATION);

        this.setToken(newToken, newRefreshToken);
        this.setTokenExpiry(tokenExpiry);

        const authState: AuthState = {
          isAuthenticated: true,
          user: currentUser,
          token: newToken,
          refreshToken: newRefreshToken,
          tokenExpiry
        };

        this.authStateSubject.next(authState);

        return {
          success: true,
          user: currentUser,
          token: newToken,
          refreshToken: newRefreshToken,
          message: 'Token renovado com sucesso'
        };
      }),
      catchError(error => {
        this.logout();
        return throwError(() => ({
          success: false,
          error: AuthError.TOKEN_EXPIRED,
          message: 'Falha ao renovar token'
        }));
      })
    );
  }

  getAuthState(): Observable<AuthState> {
    return this.authStateSubject.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.authStateSubject.pipe(
      map(state => state.user)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStateSubject.pipe(
      map(state => state.isAuthenticated && !this.isTokenExpired())
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  isTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;
    
    const expiry = new Date(expiryStr);
    return new Date() >= expiry;
  }

  registerBarbearia(data: RegisterBarbeariaRequest): Observable<AuthResult> {
    return timer(2000).pipe(
      map(() => {
        // Check if email already exists
        const existingUser = MockAuthDatabase.getUserByEmail(data.emailResponsavel);
        if (existingUser) {
          return {
            success: false,
            error: AuthError.USER_NOT_FOUND,
            message: 'Email já cadastrado no sistema'
          };
        }

        // Create new tenant and user
        const tenantId = `tenant-${Date.now()}`;
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.emailResponsavel,
          name: data.nomeBarbearia,
          role: UserRole.BARBEIRO,
          tenantId,
          isActive: true,
          createdAt: new Date()
        };

        // In a real app, this would be saved to database
        console.log('Nova barbearia cadastrada:', {
          user: newUser,
          barbearia: data
        });

        return {
          success: true,
          user: newUser,
          message: `Barbearia "${data.nomeBarbearia}" cadastrada com sucesso! Você pode fazer login agora.`
        };
      })
    );
  }

  initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getCurrentUserFromStorage();
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const tokenExpiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (token && user && !this.isTokenExpired()) {
      const tokenExpiry = tokenExpiryStr ? new Date(tokenExpiryStr) : null;
      
      this.authStateSubject.next({
        isAuthenticated: true,
        user,
        token,
        refreshToken,
        tokenExpiry
      });
    } else {
      this.clearTokens();
    }
  }

  checkTokenExpiry(): void {
    if (this.isTokenExpired() && this.authStateSubject.value.isAuthenticated) {
      this.logout().subscribe();
    }
  }

  private getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private setTokenExpiry(expiry: Date): void {
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toISOString());
  }

  private generateMockToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      exp: Date.now() + this.TOKEN_DURATION
    };
    
    return btoa(JSON.stringify(payload));
  }

  private generateMockRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh',
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    return btoa(JSON.stringify(payload));
  }

  private startTokenExpiryCheck(): void {
    // Check token expiry every minute
    timer(0, 60000).subscribe(() => {
      this.checkTokenExpiry();
    });
  }
}