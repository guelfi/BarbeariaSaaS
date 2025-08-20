# Barbearia SaaS

### Requisitos Funcionais e de Negócio  

1. Visão Geral

Este documento detalha os requisitos funcionais e de negócio para a plataforma Barbearia SaaS. A plataforma é projetada para ser um sistema multi-tenant, atendendo a dois públicos principais:

-   **Clientes Finais (Usuários do PWA Mobile):** Pessoas que buscam, agendam e gerenciam serviços em barbearias.
    
-   **Barbearias (Usuários do Dashboard Desktop):** Proprietários e gerentes que utilizam a plataforma para administrar seus negócios.
    

A arquitetura do sistema, tecnologias e status de desenvolvimento estão detalhados no documento `ArquiteturaProjeto.md`.

2. Requisitos Globais e Não Funcionais

-   **Multi-Tenancy:** O sistema deve garantir o isolamento de dados entre as barbearias (tenants). O `TenantId` será identificado via token JWT e todas as consultas ao banco de dados (MongoDB) devem ser filtradas por este ID.
    
-   **LGPD (Lei Geral de Proteção de Dados):** A plataforma deve estar 100% em conformidade com a Lei 13.709/2018. Isso inclui:
    
    -   Banner de consentimento de cookies com controle granular.
        
    -   Página de Política de Privacidade.
        
    -   Garantia dos direitos do titular (acesso, correção, exclusão, etc.).
        
    -   Para mais detalhes, consultar o `LGPD-README.md`.
        
-   **Performance:** Otimização de carregamento (lazy loading, tree shaking), visando 60fps em dispositivos móveis e Core Web Vitals otimizados.
    
-   **Segurança:** Autenticação baseada em JWT, comunicação interna entre serviços em rede Docker privada e proteção contra vulnerabilidades comuns.
    
-   **Design Responsivo:** As interfaces devem ser fluidas e adaptáveis a diferentes tamanhos de tela, seguindo os layouts do `MaterialDesign`.
    
-   **Acessibilidade (WCAG 2.1 AA):** Suporte a leitores de tela, navegação por teclado e modo de alto contraste.
    

3. Princípios de Desenvolvimento

-   **TDD (Test-Driven Development):** O desenvolvimento de novas funcionalidades deve seguir a abordagem de TDD, onde os testes são escritos antes da implementação do código.
    
-   **SOLID:** O código deve seguir os princípios SOLID para garantir que seja manutenível, escalável e robusto.
    

4. Testes

-   **Testes Unitários:** Todos os serviços e componentes devem ter testes unitários para garantir a qualidade do código.
    
-   **Testes Manuais com Curl:** Para cada endpoint da API, deve ser fornecido um script com comandos `curl` para testes manuais.
    
-   **Testes de Front-end com Cypress:** Os projetos de front-end devem utilizar o Cypress para testes de ponta a ponta (E2E).
    

---

5. Aplicação Mobile (PWA para Clientes)

**Público-alvo:** Clientes de barbearias.**Tecnologia:** React + Vite (PWA).**Fonte de Design:** `/MaterialDesign/BarbeariaMobile/`

5.1. Autenticação e Cadastro

-   **Fluxo de Login:** Permitir que o cliente se autentique com email e senha.
    
-   **Fluxo de Cadastro:** Permitir que novos clientes criem uma conta.
    
-   **Menu de Usuário:** Exibir o nome do usuário logado e a opção "Sair". Para usuários não logados, exibir "Olá. Faça seu login!".
    

5.2. Tela Inicial (Home)

-   **Busca Rápida:** Campo de busca principal e filtros rápidos por tipo de serviço (Cabelo, Barba).
    
-   **Saudação:** Mensagem de boas-vindas personalizada para usuários logados.
    
-   **Próximo Agendamento:** Exibir um card com o próximo agendamento confirmado.
    
-   **Carrosséis de Barbearias:** Listar barbearias nas categorias "Recomendados", "Populares" e "Mais Visitados".
    
-   **Card de Barbearia:** Componente reutilizável exibindo imagem, nome, endereço, avaliação e botão "Reservar".
    

5.3. Busca de Barbearias

-   **Funcionalidade de Busca:** Permitir a busca de barbearias por nome.
    
-   **Página de Resultados:** Exibir os resultados da busca em uma lista de "Cards de Barbearia".
    

5.4. Perfil da Barbearia

-   **Detalhes da Barbearia:** Exibir imagem de capa, nome, endereço, avaliação e descrição ("Sobre Nós").
    
-   **Lista de Serviços:** Apresentar todos os serviços oferecidos, com imagem, nome, descrição, preço e botão "Reservar".
    
-   **Informações Adicionais:** Exibir informações de contato (com botão para copiar) e horário de funcionamento.
    
-   **Mapa de Localização:** Integrar um mapa interativo mostrando a localização da barbearia.
    

5.5. Fluxo de Agendamento

-   **Seleção de Serviço:** Iniciar o fluxo ao clicar em "Reservar".
    
-   **Modal "Fazer Reserva":**
    

`- Exibir o serviço e preço selecionados.- Apresentar um **calendário** para seleção do dia.- Mostrar os **horários disponíveis** para a data escolhida.`

-   **Confirmação:** Após confirmar, exibir um pop-up de sucesso ("Reserva Efetuada!").
    

5.6. Tela "Meus Agendamentos"

-   **Listagem de Agendamentos:** Separar os agendamentos em abas: "Confirmados" e "Finalizados".
    
-   **Card de Agendamento:** Exibir status, nome do serviço, nome da barbearia, data e hora.
    
-   **Cancelamento:** Permitir que o usuário cancele um agendamento "Confirmado" através de um modal de confirmação.
    

5.7. Funcionalidades PWA

-   **Service Worker:** Implementar para funcionamento offline básico.
    
-   **Instalação:** Permitir que o usuário instale o PWA na tela inicial do dispositivo.
    
-   **Notificações Push:** (Sugerido) Enviar lembretes de agendamentos.
    

---

6. Aplicação Desktop (Dashboard para Barbearias)

**Público-alvo:** Donos e gerentes de barbearias (Tenants).**Tecnologia:** React + Vite.**Fonte de Design:** `/MaterialDesign/BardeariaDesktop/`

6.1. Autenticação

-   **Fluxo de Login:** Permitir que o usuário da barbearia (ex: `barbeiro@barbearia.com`) se autentique.
    
-   **Gerenciamento de Sessão:** Manter o usuário logado de forma segura.
    

6.2. Dashboard (Home Page)

-   **Visão Geral:** Apresentar um resumo dos principais indicadores do dia/semana (agendamentos, faturamento, etc.).
    
-   **Próximos Agendamentos:** Listar os próximos clientes a serem atendidos.
    
-   **Atalhos Rápidos:** Botões para as ações mais comuns (ex: "Novo Agendamento", "Cadastrar Cliente").
    

6.3. Gestão de Agendamentos

-   **Visualização em Calendário:** Exibir todos os agendamentos (passados e futuros) em uma visão de calendário (dia/semana/mês).
    
-   **Detalhes do Agendamento:** Ao clicar em um agendamento, exibir detalhes do cliente, serviço, data, hora e status.
    
-   **Ações de Agendamento:**
    

`- Criar um novo agendamento para um cliente.- Remarcar um agendamento existente.- Cancelar um agendamento (com modal de confirmação).- Marcar um agendamento como "Finalizado".`

6.4. Gestão de Clientes

-   **Lista de Clientes:** Exibir todos os clientes cadastrados na barbearia.
    
-   **Busca de Clientes:** Permitir a busca de clientes por nome ou telefone.
    
-   **Cadastro de Cliente:** Formulário para adicionar novos clientes.
    
-   **Perfil do Cliente:** Visualizar o histórico de agendamentos e serviços de um cliente específico.
    

6.5. Gestão de Serviços

-   **Lista de Serviços:** Exibir todos os serviços oferecidos pela barbearia.
    
-   **CRUD de Serviços:** Permitir criar, editar e excluir serviços (nome, descrição, preço, duração).
    

6.6. Relatórios e Análises

-   **Relatório Financeiro:** Gerar relatórios de faturamento por período.
    
-   **Relatório de Serviços:** Mostrar os serviços mais populares.
    
-   **Relatório de Clientes:** Listar os clientes mais frequentes.
    

---

7. Aplicação de Administração (SaaS Admin Dashboard)

**Público-alvo:** Administradores da plataforma SaaS.**Tecnologia:** Blazor Server + MudBlazor.

7.1. Autenticação

-   **Fluxo de Login:** Permitir que o administrador (ex: `admin@barbearia.com`) se autentique com segurança.
    

7.2. Dashboard Principal

-   **Analytics da Plataforma:** Exibir métricas globais: número de tenants (barbearias) ativos, total de agendamentos, receita total da plataforma, etc.
    
-   **Tenants Recentes:** Listar as últimas barbearias que se cadastraram.
    
-   **Atividade do Sistema:** Mostrar um log de atividades importantes na plataforma.
    

7.3. Gestão de Tenants (Barbearias)

-   **Lista de Tenants:** Exibir todas as barbearias cadastradas na plataforma.
    
-   **Busca e Filtragem:** Permitir buscar barbearias por nome ou plano e filtrar por status (ativo, inativo, pendente).
    
-   **Detalhes do Tenant:** Visualizar todas as informações de uma barbearia, incluindo usuários, plano atual e histórico de pagamentos.
    
-   **Ações de Gestão:**
    

`- Ativar ou desativar um tenant.- Alterar o plano de um tenant.- Acessar o dashboard do tenant (impersonificação para suporte).`

7.4. Gestão de Planos e Assinaturas

-   **CRUD de Planos:** Permitir que o administrador crie, edite e exclua os planos de assinatura (ex: Básico, Profissional, Premium).
    
-   **Definição de Recursos:** Para cada plano, definir os limites e recursos disponíveis (ex: número de usuários, número de agendamentos/mês, acesso a relatórios avançados).
    
-   **Gestão de Assinaturas:** Visualizar todas as assinaturas ativas e seu status de pagamento.
    

7.5. Configurações Globais

-   **Configurações da Plataforma:** Gerenciar configurações que se aplicam a todo o sistema (ex: integrações de pagamento, configurações de e-mail).
    
-   **Anúncios e Notificações:** Ferramenta para enviar anúncios ou notificações para todos os tenants.
    

8. Status do Desenvolvimento (Avaliação)

-   **Backend (.NET API):** A estrutura baseada em Clean Architecture está criada. É necessário implementar os endpoints para dar suporte a todas as funcionalidades descritas acima, incluindo a lógica de negócio multi-tenant.
    
-   **Frontend (React):** Os projetos `Web.Mobile` e `Web.Desktop` estão inicializados. O próximo passo é desenvolver os componentes reutilizáveis (Cards, Calendário, Modais) e as telas, integrando-os com a API.
    
-   **Banco de Dados (MongoDB):** O schema para as coleções (Barbearias, Clientes, Servicos, Agendamentos) precisa ser modelado e implementado, garantindo que cada documento contenha o campo `TenantId`.