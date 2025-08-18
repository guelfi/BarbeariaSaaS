# Requisitos de Build do Projeto Barbearia SaaS

Este documento descreve os requisitos para a construção (build) de cada projeto do sistema Barbearia SaaS, seguindo a ordem de prioridade definida para validação da UI/UX com dados mockados. As tarefas estão ordenadas para minimizar dependências e erros em cascata.

## 1. Web.Mobile (Angular PWA)

### Objetivo
Garantir que a aplicação Web.Mobile compile e esteja pronta para execução, permitindo a validação da interface do usuário e da experiência do usuário em dispositivos móveis, inicialmente com dados mockados.

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Angular CLI 17+

### Comandos Esperados
- Instalação de dependências: `npm install`
- Construção do projeto: `npm run build`

### Observações Iniciais
- Possíveis problemas com caminhos de importação de SCSS.
- Possíveis problemas de configuração do `angular.json` ou `tsconfig.json`.
- Necessidade de garantir que o `main.ts` esteja presente e configurado corretamente.

## 2. Web.Desktop (Angular)

### Objetivo
Garantir que a aplicação Web.Desktop compile e esteja pronta para execução, permitindo a validação da interface do usuário e da experiência do usuário em ambientes de desktop, inicialmente com dados mockados.

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Angular CLI 17+

### Comandos Esperados
- Instalação de dependências: `npm install`
- Construção do projeto: `npm run build`

### Observações Iniciais
- Já identificamos e corrigimos o problema do `extractCss` no `angular.json`.
- Já identificamos e corrigimos o problema do `tsConfig` apontando para `tsconfig.app.json` (agora aponta para `tsconfig.json`).
- Ainda existem problemas com caminhos de importação de SCSS.
- Ainda existem erros de TypeScript e módulos não encontrados (`dashboard.module`).
- Ainda existem erros de escape de caracteres em templates HTML.
- Ainda existem erros de módulos Angular Material não importados (`mat-chip-list`).

## 3. Web.Admin (Blazor Server)

### Objetivo
Garantir que a aplicação Web.Admin compile e esteja pronta para execução, permitindo a validação do painel administrativo, inicialmente com dados mockados.

### Pré-requisitos
- .NET 8.0 SDK
- ASP.NET Core Runtime

### Comandos Esperados
- Construção do projeto: `dotnet build`

### Observações Iniciais
- O projeto já compilou com sucesso, mas com avisos de segurança (`System.Text.Json`) e depreciação de Sass. Estes avisos não impedem o build, mas devem ser endereçados em uma fase posterior.
- Já corrigimos o problema do `@extend` no `_admin-dark.scss` e o posicionamento do mixin.

## 4. API (.NET Core 8)

### Objetivo
Garantir que a API backend compile e esteja pronta para execução, para futura integração com os frontends.

### Pré-requisitos
- .NET 8.0 SDK

### Comandos Esperados
- Construção do projeto: `dotnet build`

### Observações Iniciais
- A localização do arquivo `.csproj` da API foi confirmada como `src/Api/Presentation/Barbearia.Api/Barbearia.Api.csproj`.
- A API é um projeto .NET Core 8.
- A funcionalidade da API será validada após a UI/UX dos frontends.
