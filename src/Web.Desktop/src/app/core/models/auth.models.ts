export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  BARBEIRO = 'barbeiro',
  RECEPCIONISTA = 'recepcionista',
  CLIENTE = 'cliente'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: AuthError;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
}

export enum AuthError {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  USER_INACTIVE = 'user_inactive',
  TOKEN_EXPIRED = 'token_expired',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface RegisterBarbeariaRequest {
  nomeBarbearia: string;
  emailResponsavel: string;
  senha: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}