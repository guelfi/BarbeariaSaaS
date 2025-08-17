import { User, UserRole } from '../models/auth.models';

export const MOCK_USERS: User[] = [
  // Clientes Demo
  {
    id: 'cliente-001',
    email: 'cliente@email.com',
    name: 'Pedro Costa',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    phone: '(11) 99999-1234'
  },
  {
    id: 'cliente-002',
    email: 'jose@email.com',
    name: 'José Ferreira',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-02-05'),
    phone: '(11) 99999-5678'
  },
  {
    id: 'cliente-003',
    email: 'ana@email.com',
    name: 'Ana Silva',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-001',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    phone: '(11) 99999-9012'
  },
  {
    id: 'cliente-004',
    email: 'marcos@email.com',
    name: 'Marcos Oliveira',
    role: UserRole.CLIENTE,
    tenantId: 'tenant-002',
    isActive: true,
    createdAt: new Date('2024-02-15'),
    phone: '(11) 99999-3456'
  }
];

export const MOCK_PASSWORDS: { [email: string]: string } = {
  'cliente@email.com': 'Cliente123!',
  'jose@email.com': 'Jose123!',
  'ana@email.com': 'Ana123!',
  'marcos@email.com': 'Marcos123!'
};

export const MOCK_BARBEARIAS = [
  {
    id: 'tenant-001',
    nome: 'Barbearia Central',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 3333-1234'
  },
  {
    id: 'tenant-002',
    nome: 'Corte & Estilo',
    endereco: 'Av. Paulista, 456 - Bela Vista',
    telefone: '(11) 3333-5678'
  }
];

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
  
  static getBarbearias() {
    return MOCK_BARBEARIAS;
  }
  
  static createCliente(data: any): User {
    const newUser: User = {
      id: `cliente-${Date.now()}`,
      email: data.email,
      name: data.nome,
      role: UserRole.CLIENTE,
      tenantId: data.tenantId || 'tenant-001',
      isActive: true,
      createdAt: new Date(),
      phone: data.telefone
    };
    
    MOCK_USERS.push(newUser);
    MOCK_PASSWORDS[newUser.email] = data.senha;
    
    return newUser;
  }
  
  static hashPassword(password: string): string {
    // Simple mock hash - in real app would use bcrypt or similar
    return btoa(password + 'salt123');
  }
  
  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}