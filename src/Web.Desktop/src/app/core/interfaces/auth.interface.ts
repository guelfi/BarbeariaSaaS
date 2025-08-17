import { Observable } from 'rxjs';
import { 
  LoginRequest, 
  AuthResult, 
  AuthState, 
  User, 
  RegisterBarbeariaRequest 
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
  registerBarbearia(data: RegisterBarbeariaRequest): Observable<AuthResult>;
  
  // Utility methods
  initializeAuthState(): void;
  checkTokenExpiry(): void;
}