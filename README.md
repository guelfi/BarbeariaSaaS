# Projeto Barbearia (SaaS)

Este documento descreve a arquitetura e as tecnologias escolhidas para o desenvolvimento do sistema de agendamento da Barbearia, projetado como uma plataforma **Multi-Tenant (SaaS)**.

## Visão Geral

O projeto consiste em uma plataforma SaaS (Software as a Service) que permite a múltiplas barbearias ("inquilinos" ou "tenants") gerenciarem seus negócios de forma independente e segura. Cada barbearia terá acesso ao seu próprio ambiente dentro do sistema, que inclui uma API backend, uma aplicação desktop para administração e uma aplicação mobile para clientes.

## Arquitetura Multi-Tenant (SaaS)

A aplicação será construída desde o início para suportar múltiplos inquilinos, garantindo segurança e isolamento de dados.

*   **Modelo de Inquilinato:** Multi-tenancy será implementado em nível de aplicação com um **banco de dados compartilhado**.
*   **Identificação do Inquilino:** A identificação do `TenantId` (ID da Barbearia) será feita através de um *claim* no **token JWT** do usuário após o login. Cada requisição à API conterá essa informação, garantindo que o usuário só possa acessar os dados da sua própria barbearia.
*   **Isolamento de Dados:** No MongoDB, todos os documentos relevantes (Agendamentos, Clientes, Serviços, etc.) conterão um campo `TenantId`. A camada de acesso a dados (Repository Pattern) será responsável por filtrar automaticamente todas as consultas com base no `TenantId` do usuário autenticado, prevenindo qualquer vazamento de dados entre inquilinos.

## Stack de Tecnologia

### Backend
*   **Framework:** .NET Core 8
*   **Autenticação:** JWT (JSON Web Token) com *claims* de `TenantId`.

### Aplicação Desktop
*   **Framework:** Blazor
*   **Biblioteca de Componentes:** MudBlazor
*   **Diretriz de Design:** Material UI (Google)

### Aplicação Mobile
*   **Framework:** React
*   **Biblioteca de Componentes:** Material-UI
*   **Tipo:** Progressive Web App (PWA)
*   **Diretriz de Design:** Material UI (Google)

### Banco de Dados
*   **Tipo:** NoSQL
*   **Sistema:** MongoDB
*   **Schema:** Compartilhado com um campo `TenantId` para isolamento de dados.

## Arquitetura e Princípios de Design

O desenvolvimento seguirá as melhores práticas para construir uma aplicação SaaS robusta, escalável e de fácil manutenção.

*   **Clean Architecture:** A estrutura do projeto será baseada na Clean Architecture. As lógicas de negócio e de aplicação serão conscientemente desenhadas para operar em um contexto multi-tenant.
*   **Domain-Driven Design (DDD):** A entidade `Tenant` (ou `Barbearia`) será um agregado raiz central no domínio. Outros agregados, como `Agendamento` e `Cliente`, serão sempre associados a um `Tenant`.
*   **SOLID:** Os cinco princípios do SOLID serão aplicados.
*   **Test-Driven Development (TDD):** O desenvolvimento será orientado por testes, incluindo testes que garantam o correto isolamento de dados entre os inquilinos.
*   **Repository Pattern:** A implementação do repositório garantirá que todas as operações de dados sejam automaticamente filtradas pelo `TenantId` do contexto da requisição.
*   **Clean Code:** Serão aplicadas práticas de Clean Code.