# Requirements Document - Telas de Login Multi-Frontend

## Introduction

Este documento define os requisitos para o desenvolvimento de três telas de login distintas para o sistema Barbearia SaaS, cada uma servindo um frontend específico: Web.Admin (Blazor + MudBlazor), Web.Desktop (Angular + Material UI), e Web.Mobile (Angular PWA + Material UI). As telas devem ser modernas, elegantes e fluidas, seguindo os wireframes disponíveis na pasta MaterialDesign, e incluir simulação de autenticação sem necessidade de API backend.

## Requirements

### Requirement 1 - Tela de Login Web.Admin (Blazor + MudBlazor)

**User Story:** Como administrador do SaaS, eu quero uma tela de login administrativa elegante e profissional, para que eu possa acessar o dashboard de gestão de tenants de forma segura e intuitiva.

#### Acceptance Criteria

1. WHEN o usuário acessa a aplicação Web.Admin THEN o sistema SHALL exibir uma tela de login com design Material Design usando MudBlazor
2. WHEN a tela de login é carregada THEN o sistema SHALL exibir campos para email e senha com validação visual e opção de visualizar/ocultar senha
3. WHEN o usuário clica no ícone de visualizar senha THEN o sistema SHALL alternar entre texto oculto e visível no campo senha
4. WHEN o usuário insere credenciais válidas (guelfi@msn.com / @5ST73EA4x) THEN o sistema SHALL simular login bem-sucedido e redirecionar para tela "Em Desenvolvimento"
5. WHEN o usuário insere credenciais inválidas THEN o sistema SHALL exibir mensagem de erro elegante sem redirecionar
6. WHEN o login é bem-sucedido THEN o sistema SHALL armazenar estado de autenticação simulado no localStorage
7. WHEN a tela é exibida THEN o sistema SHALL ter design responsivo e profissional adequado para administradores

### Requirement 2 - Tela de Login Web.Desktop (Angular + Material UI)

**User Story:** Como usuário de barbearia (barbeiro/recepcionista), eu quero uma tela de login desktop moderna e intuitiva, para que eu possa acessar o sistema de gestão da barbearia seguindo o design dos wireframes.

#### Acceptance Criteria

1. WHEN o usuário acessa a aplicação Web.Desktop THEN o sistema SHALL exibir tela de login baseada nos wireframes da pasta MaterialDesign/BardeariaDesktop
2. WHEN a tela é carregada THEN o sistema SHALL usar Angular Material UI com tema personalizado seguindo o design dos wireframes
3. WHEN a tela de login é exibida THEN o sistema SHALL incluir opção de visualizar/ocultar senha e link para cadastro de nova barbearia
4. WHEN o usuário clica em "Cadastrar Barbearia" THEN o sistema SHALL navegar para tela de cadastro simulado
5. WHEN o usuário insere credenciais válidas (barbeiro@barbearia.com / Barbeiro123!) THEN o sistema SHALL simular autenticação e redirecionar para tela "Em Desenvolvimento"
6. WHEN o usuário insere credenciais inválidas THEN o sistema SHALL exibir feedback visual de erro com animações suaves
7. WHEN a interface é exibida THEN o sistema SHALL ser responsiva e otimizada para uso em desktop/tablet
8. WHEN o login é realizado THEN o sistema SHALL implementar transições fluidas entre estados da interface

### Requirement 3 - Tela de Login Web.Mobile (Angular PWA + Material UI)

**User Story:** Como cliente da barbearia, eu quero uma tela de login mobile moderna e touch-friendly, para que eu possa acessar o app de agendamentos de forma rápida e intuitiva no meu smartphone.

#### Acceptance Criteria

1. WHEN o cliente acessa a PWA Web.Mobile THEN o sistema SHALL exibir tela de login otimizada para mobile baseada nos wireframes da pasta MaterialDesign/BarbeariaMobile
2. WHEN a tela é carregada THEN o sistema SHALL usar Angular Material UI com design mobile-first e gestos touch otimizados
3. WHEN a tela de login é exibida THEN o sistema SHALL incluir opção de visualizar/ocultar senha e link para cadastro de novo cliente
4. WHEN o cliente clica em "Criar Conta" THEN o sistema SHALL navegar para tela de cadastro de cliente simulado
5. WHEN o cliente insere credenciais válidas (cliente@email.com / Cliente123!) THEN o sistema SHALL simular login e redirecionar para tela "Em Desenvolvimento"
6. WHEN credenciais inválidas são inseridas THEN o sistema SHALL exibir feedback tátil e visual apropriado para mobile
7. WHEN a PWA é usada THEN o sistema SHALL funcionar offline para a tela de login com dados simulados
8. WHEN em dispositivos móveis THEN o sistema SHALL ter performance otimizada e animações fluidas de 60fps

### Requirement 4 - Simulação de Autenticação

**User Story:** Como desenvolvedor, eu quero um sistema de autenticação simulado funcional, para que eu possa testar os fluxos de login sem depender da API backend ainda não desenvolvida.

#### Acceptance Criteria

1. WHEN qualquer frontend realiza login THEN o sistema SHALL validar credenciais contra lista hardcoded de usuários válidos
2. WHEN login é bem-sucedido THEN o sistema SHALL armazenar token simulado e dados do usuário no localStorage
3. WHEN login falha THEN o sistema SHALL retornar erro específico (credenciais inválidas, usuário não encontrado, etc.)
4. WHEN usuário está autenticado THEN o sistema SHALL manter estado entre recarregamentos de página
5. WHEN logout é executado THEN o sistema SHALL limpar dados de autenticação e redirecionar para login
6. WHEN token expira (simulado após 1 hora) THEN o sistema SHALL automaticamente deslogar o usuário

### Requirement 5 - Tela "Em Desenvolvimento"

**User Story:** Como usuário autenticado, eu quero uma tela informativa e elegante indicando que o sistema está em desenvolvimento, para que eu entenda o status atual e tenha expectativas adequadas.

#### Acceptance Criteria

1. WHEN login é bem-sucedido em qualquer frontend THEN o sistema SHALL redirecionar para tela "Em Desenvolvimento" específica do frontend
2. WHEN a tela é exibida THEN o sistema SHALL mostrar mensagem clara sobre status de desenvolvimento
3. WHEN na tela de desenvolvimento THEN o sistema SHALL exibir informações do usuário logado e opção de logout
4. WHEN a tela é mostrada THEN o sistema SHALL manter consistência visual com o design do respectivo frontend
5. WHEN usuário clica em logout THEN o sistema SHALL limpar autenticação e retornar à tela de login
6. WHEN a tela é acessada THEN o sistema SHALL incluir elementos visuais que indiquem progresso/roadmap futuro

### Requirement 6 - Consistência Visual e UX

**User Story:** Como usuário de qualquer frontend, eu quero uma experiência visual consistente e de alta qualidade, para que eu tenha confiança na plataforma e facilidade de uso.

#### Acceptance Criteria

1. WHEN qualquer tela é exibida THEN o sistema SHALL seguir princípios de Material Design com personalização adequada
2. WHEN transições ocorrem THEN o sistema SHALL usar animações suaves e consistentes (duração 200-300ms)
3. WHEN erros são exibidos THEN o sistema SHALL usar feedback visual claro com cores e ícones apropriados
4. WHEN em diferentes dispositivos THEN o sistema SHALL manter usabilidade e legibilidade em todas as resoluções
5. WHEN elementos interativos são usados THEN o sistema SHALL fornecer feedback visual imediato (hover, focus, active states)
6. WHEN carregamento ocorre THEN o sistema SHALL exibir indicadores de progresso elegantes e informativos
### R
equirement 7 - Cadastro de Barbearias (SaaS Onboarding)

**User Story:** Como proprietário de barbearia, eu quero me cadastrar na plataforma SaaS de forma simples e intuitiva, para que eu possa começar a usar o sistema de gestão da minha barbearia como um novo tenant.

#### Acceptance Criteria

1. WHEN o usuário clica em "Cadastrar Barbearia" no Web.Desktop THEN o sistema SHALL exibir formulário de cadastro de nova barbearia
2. WHEN o formulário é exibido THEN o sistema SHALL solicitar dados básicos (nome da barbearia, email do responsável, senha, telefone, endereço)
3. WHEN o usuário preenche dados válidos THEN o sistema SHALL simular criação de novo tenant e exibir mensagem de sucesso
4. WHEN o cadastro é concluído THEN o sistema SHALL redirecionar automaticamente para login com as credenciais criadas
5. WHEN dados inválidos são inseridos THEN o sistema SHALL exibir validações específicas por campo em tempo real
6. WHEN o processo é concluído THEN o sistema SHALL simular envio de email de boas-vindas e próximos passos

### Requirement 8 - Cadastro de Clientes

**User Story:** Como cliente, eu quero me cadastrar no app da barbearia de forma rápida e simples, para que eu possa fazer agendamentos e acompanhar meu histórico.

#### Acceptance Criteria

1. WHEN o cliente clica em "Criar Conta" no Web.Mobile THEN o sistema SHALL exibir formulário de cadastro de cliente
2. WHEN o formulário é exibido THEN o sistema SHALL solicitar dados essenciais (nome, email, senha, telefone)
3. WHEN o cliente preenche dados válidos THEN o sistema SHALL simular criação de conta e exibir confirmação
4. WHEN o cadastro é concluído THEN o sistema SHALL fazer login automático e redirecionar para tela "Em Desenvolvimento"
5. WHEN dados inválidos são inseridos THEN o sistema SHALL exibir feedback visual imediato e específico
6. WHEN o processo é finalizado THEN o sistema SHALL simular envio de SMS/email de confirmação