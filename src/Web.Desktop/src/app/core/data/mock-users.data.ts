import { User, UserRole } from '../models/auth.models';

export const MOCK_USERS: User[] = [
  // Admin SaaS
  {
    id: 'admin-001',
    email: 'guelfi@msn.com',
    name: 'Administrador SaaS',
    role: UserRole.ADMIN,
    tenantId: 'saas-admin',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  
  // Barbearia Demo - Barbeiros
  {
    id: 'barbeiro-001',
    email: 'barbeiro@barbearia.com',
    name: 'João Silva',
    role: UserRole.BARBEIRO,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'barbeiro-002',
    email: 'carlos@barbearia.com',
    name: 'Carlos Santos',
    role: UserRole.BARBEIRO,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  
  // Barbearia Demo - Recepcionista
  {
    id: 'recep-001',
    email: 'recepcao@barbearia.com',
    name: 'Maria Oliveira',
    role: UserRole.RECEPCIONISTA,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  
  // Clientes Demo
  {
    id: 'cliente-001',
    email: 'cliente@email.com',
    name: 'Pedro Costa',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'cliente-002',
    email: 'jose@email.com',
    name: 'José Ferreira',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-02-05')
  }
];

export const MOCK_PASSWORDS: { [email: string]: string } = {
  'guelfi@msn.com': '@5ST73EA4x',
  'barbeiro@barbearia.com': 'Barbeiro123!',
  'carlos@barbearia.com': 'Carlos123!',
  'recepcao@barbearia.com': 'Recepcao123!',
  'cliente@email.com': 'Cliente123!',
  'jose@email.com': 'Jose123!'
};

export class MockAuthDatabase {
  static validateCredentials(email: string, password: string): User | null {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return null;
    }
    
    if (!user.isActive) {
      return null;
    }
    
    const expectedPassword = MOCK_PASSWORDS[user.email];
    if (expectedPassword !== password) {
      return null;
    }
    
    return user;
  }
  
  static getUserByEmail(email: string): User | null {
    return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  
  static getUserById(id: string): User | null {
    return MOCK_USERS.find(u => u.id === id) || null;
  }
  
  static getUsersByTenant(tenantId: string): User[] {
    return MOCK_USERS.filter(u => u.tenantId === tenantId);
  }
  
  static hashPassword(password: string): string {
    // Simple mock hash - in real app would use bcrypt or similar
    return btoa(password + 'salt123');
  }
  
  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}