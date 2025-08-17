import { Observable } from 'rxjs';
import { 
  LoginRequest, 
  AuthResult, 
  AuthState, 
  User, 
  RegisterClienteRequest 
} from '../models/auth.models';

export interface IAuthService {
  // Authentication methods
  login(credentials: LoginRequest): Observable<AuthResult>;
  logout(): Observable<boolean>;
  refreshToken(): Observable<AuthResult>;
  
  // State management
  getAuthState(): Observable<AuthState>;
  getCurrentUser(): Observable<User | null>;
  isAuthenticated(): Observable<boolean>;
  
  // Token management
  getToken(): string | null;
  setToken(token: string, refreshToken?: string): void;
  clearTokens(): void;
  isTokenExpired(): boolean;
  
  // Registration
  registerCliente(data: RegisterClienteRequest): Observable<AuthResult>;
  
  // PWA specific methods
  enableOfflineMode(): void;
  isOfflineMode(): boolean;
  syncWhenOnline(): Observable<boolean>;
  
  // Utility methods
  initializeAuthState(): void;
  checkTokenExpiry(): void;
}