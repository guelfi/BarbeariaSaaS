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
  RegisterClienteRequest,
  UserRole
} from '../models/auth.models';
import { MockAuthDatabase } from '../data/mock-users.data';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private readonly TOKEN_KEY = 'barbearia_mobile_token';
  private readonly REFRESH_TOKEN_KEY = 'barbearia_mobile_refresh_token';
  private readonly USER_KEY = 'barbearia_mobile_user';
  private readonly TOKEN_EXPIRY_KEY = 'barbearia_mobile_token_expiry';
  private readonly OFFLINE_MODE_KEY = 'barbearia_mobile_offline';
  
  private readonly TOKEN_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null
  });

  private isOffline = false;

  constructor() {
    this.initializeAuthState();
    this.startTokenExpiryCheck();
    this.checkNetworkStatus();
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

        // Only allow clientes in mobile app
        if (user.role !== UserRole.CLIENTE) {
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

        // Trigger haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }

        return {
          success: true,
          user,
          token,
          refreshToken,
          message: 'Login realizado com sucesso'
        };
      }),
      catchError(error => {
        // Trigger error haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 100, 100]);
        }
        
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

  registerCliente(data: RegisterClienteRequest): Observable<AuthResult> {
    return timer(2000).pipe(
      map(() => {
        // Check if email already exists
        const existingUser = MockAuthDatabase.getUserByEmail(data.email);
        if (existingUser) {
          return {
            success: false,
            error: AuthError.USER_NOT_FOUND,
            message: 'Email já cadastrado no sistema'
          };
        }

        // Create new cliente
        const newUser = MockAuthDatabase.createCliente(data);

        // Auto login after registration
        const token = this.generateMockToken(newUser);
        const refreshToken = this.generateMockRefreshToken(newUser);
        const tokenExpiry = new Date(Date.now() + this.TOKEN_DURATION);

        this.setToken(token, refreshToken);
        this.setUser(newUser);
        this.setTokenExpiry(tokenExpiry);

        const authState: AuthState = {
          isAuthenticated: true,
          user: newUser,
          token,
          refreshToken,
          tokenExpiry
        };

        this.authStateSubject.next(authState);

        // Success haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }

        return {
          success: true,
          user: newUser,
          token,
          refreshToken,
          message: `Conta criada com sucesso! Bem-vindo, ${newUser.name}!`
        };
      })
    );
  }

  enableOfflineMode(): void {
    this.isOffline = true;
    localStorage.setItem(this.OFFLINE_MODE_KEY, 'true');
  }

  isOfflineMode(): boolean {
    return this.isOffline || localStorage.getItem(this.OFFLINE_MODE_KEY) === 'true';
  }

  syncWhenOnline(): Observable<boolean> {
    if (navigator.onLine) {
      this.isOffline = false;
      localStorage.removeItem(this.OFFLINE_MODE_KEY);
      return of(true);
    }
    return of(false);
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

  private checkNetworkStatus(): void {
    window.addEventListener('online', () => {
      this.syncWhenOnline().subscribe();
    });

    window.addEventListener('offline', () => {
      this.enableOfflineMode();
    });
  }
}