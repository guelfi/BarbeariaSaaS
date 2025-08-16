# Implementation Plan - Telas de Login Multi-Frontend

- [ ] 1. Configurar estrutura base dos projetos
  - Criar projetos Angular para Web.Desktop e Web.Mobile com Angular Material
  - Configurar projeto Blazor Server para Web.Admin com MudBlazor
  - Instalar dependências Sass/SCSS em todos os projetos
  - Configurar estrutura de pastas seguindo Clean Architecture
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 2. Implementar serviço de autenticação simulada
  - [ ] 2.1 Criar interface IAuthService com métodos de login/logout
    - Definir contratos TypeScript/C# para autenticação
    - Implementar modelos de dados User, AuthResult, AuthState
    - Criar enum para tipos de erro de autenticação
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 2.2 Implementar mock database com usuários hardcoded
    - Criar lista de usuários válidos incluindo admin (guelfi@msn.com)
    - Implementar validação de credenciais simulada
    - Adicionar simulação de hash de senha
    - _Requirements: 4.1, 1.4, 2.5, 3.5_

  - [ ] 2.3 Implementar gerenciamento de estado de autenticação
    - Criar serviço para armazenar token no localStorage
    - Implementar verificação de expiração de token (1 hora)
    - Adicionar auto-logout quando token expira
    - Manter estado entre recarregamentos de página
    - _Requirements: 4.2, 4.4, 4.5, 4.6_

- [ ] 3. Desenvolver sistema de estilos Sass/SCSS
  - [ ] 3.1 Criar variáveis e mixins base
    - Definir paleta de cores para cada frontend
    - Criar variáveis de tipografia e espaçamento
    - Implementar mixins para responsividade e componentes
    - _Requirements: 6.1, 6.4_

  - [ ] 3.2 Implementar temas claro e escuro
    - Criar arquivos de tema para cada frontend
    - Implementar CSS custom properties para troca dinâmica
    - Adicionar suporte a preferência do sistema
    - _Requirements: 6.1, 6.5_

- [ ] 4. Implementar tela de login Web.Admin (Blazor + MudBlazor)
  - [ ] 4.1 Criar componente LoginPage.razor
    - Implementar layout responsivo com MudBlazor
    - Adicionar logo e branding administrativo
    - Criar formulário com validação em tempo real
    - _Requirements: 1.1, 1.2, 1.7_

  - [ ] 4.2 Implementar funcionalidade de visualizar senha
    - Adicionar botão toggle para mostrar/ocultar senha
    - Implementar ícones de olho aberto/fechado
    - Adicionar feedback visual no estado ativo
    - _Requirements: 1.3_

  - [ ] 4.3 Integrar autenticação e navegação
    - Conectar formulário com AuthService
    - Implementar redirecionamento após login bem-sucedido
    - Adicionar tratamento de erros com mensagens elegantes
    - Armazenar estado de autenticação no localStorage
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 5. Implementar tela de login Web.Desktop (Angular + Material UI)
  - [ ] 5.1 Criar componente de login baseado nos wireframes
    - Analisar wireframes da pasta MaterialDesign/BardeariaDesktop
    - Implementar layout seguindo design dos wireframes
    - Usar Angular Material com tema personalizado
    - _Requirements: 2.1, 2.2_

  - [ ] 5.2 Adicionar funcionalidades de login e cadastro
    - Implementar toggle de visualização de senha
    - Adicionar link "Cadastrar Barbearia" com navegação
    - Criar validação de formulário com feedback visual
    - _Requirements: 2.3, 2.4_

  - [ ] 5.3 Implementar autenticação e transições
    - Integrar com serviço de autenticação Angular
    - Adicionar animações suaves entre estados
    - Implementar redirecionamento após login
    - Otimizar para uso desktop/tablet
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

- [ ] 6. Implementar tela de login Web.Mobile (Angular PWA + Material UI)
  - [ ] 6.1 Criar componente PWA otimizado para mobile
    - Analisar wireframes da pasta MaterialDesign/BarbeariaMobile
    - Implementar design mobile-first com gestos touch
    - Usar Angular Material com otimizações mobile
    - _Requirements: 3.1, 3.2_

  - [ ] 6.2 Adicionar funcionalidades mobile-específicas
    - Implementar toggle de senha touch-friendly
    - Adicionar link "Criar Conta" para cadastro de cliente
    - Criar feedback tátil (vibração) para erros
    - _Requirements: 3.3, 3.4, 3.6_

  - [ ] 6.3 Implementar recursos PWA
    - Configurar Service Worker para funcionamento offline
    - Otimizar performance para 60fps em dispositivos móveis
    - Implementar cache de dados de login simulados
    - Adicionar suporte a safe areas para dispositivos com notch
    - _Requirements: 3.5, 3.7, 3.8_

- [ ] 7. Implementar formulários de cadastro
  - [ ] 7.1 Criar formulário de cadastro de barbearia (Web.Desktop)
    - Implementar formulário com campos: nome, email, senha, telefone, endereço
    - Adicionar validação em tempo real por campo
    - Criar simulação de criação de novo tenant
    - Implementar redirecionamento automático para login
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 7.2 Criar formulário de cadastro de cliente (Web.Mobile)
    - Implementar formulário simplificado: nome, email, senha, telefone
    - Adicionar validação com feedback visual mobile
    - Simular criação de conta e login automático
    - Implementar simulação de envio de SMS/email
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 8. Implementar telas "Em Desenvolvimento"
  - [ ] 8.1 Criar tela de desenvolvimento para Web.Admin
    - Implementar layout consistente com design administrativo
    - Exibir informações do usuário logado (admin)
    - Adicionar botão de logout funcional
    - Incluir elementos visuais de progresso/roadmap
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 8.2 Criar tela de desenvolvimento para Web.Desktop
    - Implementar design consistente com tema da barbearia
    - Mostrar dados do usuário barbeiro/recepcionista
    - Adicionar funcionalidade de logout
    - Incluir indicadores de funcionalidades futuras
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 8.3 Criar tela de desenvolvimento para Web.Mobile
    - Implementar layout mobile otimizado
    - Exibir informações do cliente logado
    - Adicionar botão de logout touch-friendly
    - Incluir roadmap visual de funcionalidades
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 9. Implementar sistema de roteamento e guards
  - [ ] 9.1 Configurar roteamento Angular (Web.Desktop e Web.Mobile)
    - Implementar rotas para login, cadastro e desenvolvimento
    - Criar AuthGuard para proteger rotas autenticadas
    - Adicionar redirecionamentos baseados em estado de auth
    - _Requirements: 4.4, 4.5_

  - [ ] 9.2 Configurar navegação Blazor (Web.Admin)
    - Implementar NavigationManager para redirecionamentos
    - Criar componente de proteção de rotas
    - Adicionar verificação de autenticação em páginas protegidas
    - _Requirements: 4.4, 4.5_

- [ ] 10. Implementar validações e tratamento de erros
  - [ ] 10.1 Criar sistema de validação de formulários
    - Implementar validações client-side para todos os campos
    - Adicionar mensagens de erro específicas e claras
    - Criar feedback visual consistente entre frontends
    - _Requirements: 6.3, 7.5, 8.5_

  - [ ] 10.2 Implementar tratamento de erros de autenticação
    - Criar enum de tipos de erro padronizado
    - Implementar exibição de erros específica por frontend
    - Adicionar logging de erros para debugging
    - _Requirements: 4.3, 6.3_

- [ ] 11. Implementar animações e transições
  - [ ] 11.1 Criar animações de entrada e saída
    - Implementar fade-in para carregamento de páginas
    - Adicionar slide-up para modais e formulários
    - Criar transições suaves entre estados de loading
    - _Requirements: 6.2, 6.5_

  - [ ] 11.2 Otimizar animações para performance
    - Usar transform e opacity para animações GPU-aceleradas
    - Implementar will-change para otimização
    - Adicionar prefers-reduced-motion para acessibilidade
    - _Requirements: 6.2, 3.8_

- [ ] 12. Implementar testes automatizados
  - [ ] 12.1 Criar testes unitários para serviços de autenticação
    - Testar lógica de validação de credenciais
    - Verificar gerenciamento de estado de autenticação
    - Testar cenários de erro e edge cases
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 12.2 Criar testes E2E com Cypress
    - Implementar testes de fluxo completo de login
    - Testar cadastros de barbearia e cliente
    - Verificar navegação entre telas
    - Testar responsividade em diferentes dispositivos
    - _Requirements: 1.4, 2.5, 3.5, 7.3, 8.3_

- [ ] 13. Otimizar performance e acessibilidade
  - [ ] 13.1 Implementar otimizações de bundle
    - Configurar lazy loading para módulos de autenticação
    - Implementar tree shaking para componentes não utilizados
    - Otimizar imagens e assets estáticos
    - _Requirements: 6.4, 3.8_

  - [ ] 13.2 Implementar recursos de acessibilidade
    - Adicionar labels e ARIA attributes apropriados
    - Implementar navegação por teclado
    - Testar com screen readers
    - Adicionar suporte a high contrast mode
    - _Requirements: 6.4, 6.5_

- [ ] 14. Configurar build e deploy
  - [ ] 14.1 Configurar scripts de build para produção
    - Implementar minificação de CSS e JavaScript
    - Configurar otimização de imagens
    - Criar builds separados para cada frontend
    - _Requirements: 6.1_

  - [ ] 14.2 Preparar configuração de deploy
    - Criar Dockerfiles para cada aplicação
    - Configurar variáveis de ambiente
    - Preparar scripts de deploy automatizado
    - _Requirements: 6.1_