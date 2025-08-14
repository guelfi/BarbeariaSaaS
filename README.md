# 💈 Projeto Barbearia (SaaS)

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Blazor](https://img.shields.io/badge/Blazor-512BD4?style=flat&logo=blazor&logoColor=white)](https://blazor.net/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Este documento descreve a arquitetura e as tecnologias escolhidas para o desenvolvimento do sistema de agendamento da Barbearia, projetado como uma plataforma **Multi-Tenant (SaaS)**.

## � VÍndice

- [🚀 Visão Geral](#-visão-geral)
- [🏛️ Arquitetura Multi-Tenant](#️-arquitetura-multi-tenant-saas)
- [🛠️ Stack de Tecnologia](#️-stack-de-tecnologia)
- [📐 Arquitetura e Princípios](#-arquitetura-e-princípios-de-design)
- [☁️ Estratégia de Deploy](#️-estratégia-de-deploy-cloud)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎯 Status do Desenvolvimento](#-status-atual-do-desenvolvimento)

## 🚀 Visão Geral

O projeto consiste em uma plataforma SaaS (Software as a Service) que permite a múltiplas barbearias ("inquilinos" ou "tenants") gerenciarem seus negócios de forma independente e segura. Cada barbearia terá acesso ao seu próprio ambiente dentro do sistema, que inclui uma API backend, uma aplicação desktop para administração e uma aplicação mobile para clientes.

### 🎯 Funcionalidades Principais

**Para Barbearias (Tenants):**
- ✂️ Gestão completa de agendamentos
- 👥 Cadastro e gerenciamento de clientes
- 💼 Controle de serviços e preços
- 📊 Relatórios e dashboard analítico
- 💰 Controle financeiro e faturamento

**Para Clientes:**
- 📱 Agendamento via PWA mobile
- 🔍 Busca de barbearias próximas
- ⭐ Avaliação de serviços
- 📅 Histórico de agendamentos
- 🔔 Notificações push

**Para Administradores SaaS:**
- 🏢 Gestão de barbearias (tenants)
- 💳 Controle de planos e pagamentos
- 📈 Analytics da plataforma
- 🛠️ Configurações globais

## 🏛️ Arquitetura Multi-Tenant (SaaS)

A aplicação será construída desde o início para suportar múltiplos inquilinos, garantindo segurança e isolamento de dados.

*   **Modelo de Inquilinato:** Multi-tenancy será implementado em nível de aplicação com um **banco de dados compartilhado**.
*   **Identificação do Inquilino:** A identificação do `TenantId` (ID da Barbearia) será feita através de um *claim* no **token JWT** do usuário após o login. Cada requisição à API conterá essa informação, garantindo que o usuário só possa acessar os dados da sua própria barbearia.
*   **Isolamento de Dados:** No MongoDB, todos os documentos relevantes (Agendamentos, Clientes, Serviços, etc.) conterão um campo `TenantId`. A camada de acesso a dados (Repository Pattern) será responsável por filtrar automaticamente todas as consultas com base no `TenantId` do usuário autenticado, prevenindo qualquer vazamento de dados entre inquilinos.

## 🛠️ Stack de Tecnologia

### ⚙️ Backend
| Componente | Tecnologia | Versão | Descrição |
|------------|------------|--------|-----------|
| **Framework** | .NET Core | 8.0 | API REST robusta e performática |
| **Autenticação** | JWT | - | Tokens com claims de `TenantId` |
| **Banco de Dados** | MongoDB | 7.0+ | NoSQL com schema compartilhado |
| **ORM** | MongoDB.Driver | - | Driver oficial para .NET |

### 💻 Aplicação Desktop
| Componente | Tecnologia | Descrição |
|------------|------------|-----------|
| **Framework** | Blazor Server | Interface administrativa responsiva |
| **UI Library** | MudBlazor | Componentes Material Design |
| **Styling** | Material UI | Design system do Google |

### �️ Aplicação Mobile
| Componente | Tecnologia | Descrição |
|------------|------------|-----------|
| **Framework** | Angular | PWA para clientes |
| **UI Library** | Angular Material | Componentes Material Design |
| **Tipo** | Progressive Web App | Experiência nativa no mobile |

### �️ Aaplicação Administrativa SaaS
| Componente | Tecnologia | Descrição |
|------------|------------|-----------|
| **Framework** | Blazor Server | Dashboard para gestão do SaaS |
| **UI Library** | MudBlazor | Consistência visual com desktop |
| **Funcionalidades** | - | Gestão de tenants, planos e pagamentos |

### ☁️ Infraestrutura
| Componente | Tecnologia | Descrição |
|------------|------------|-----------|
| **Containerização** | Docker | Isolamento e portabilidade |
| **Proxy Reverso** | Nginx | Load balancing e SSL |
| **SO** | Ubuntu 22.04 | Sistema operacional do servidor |
| **Cloud** | Multi-provider | OCI, AWS, GCP, Azure |

## 📐 Arquitetura e Princípios de Design

O desenvolvimento seguirá as melhores práticas para construir uma aplicação SaaS robusta, escalável e de fácil manutenção.

*   **Clean Architecture:** A estrutura do projeto será baseada na Clean Architecture. As lógicas de negócio e de aplicação serão conscientemente desenhadas para operar em um contexto multi-tenant.

*   **Domain-Driven Design (DDD):** A entidade `Tenant` (ou `Barbearia`) será um agregado raiz central no domínio. Outros agregados, como `Agendamento` e `Cliente`, serão sempre associados a um `Tenant`.
*   **SOLID:** Os cinco princípios do SOLID serão aplicados.
*   **Test-Driven Development (TDD):** O desenvolvimento será orientado por testes, incluindo testes que garantam o correto isolamento de dados entre os inquilinos.
*   **Repository Pattern:** A implementação do repositório garantirá que todas as operações de dados sejam automaticamente filtradas pelo `TenantId` do contexto da requisição.
*   **Clean Code:** Serão aplicadas práticas de Clean Code.

## ☁️ Estratégia de Deploy (Cloud)

A implantação do projeto será feita em um ambiente de nuvem, utilizando contêineres Docker para garantir consistência e escalabilidade.

### 🐳 Arquitetura de Contêineres

O sistema será dividido em três contêineres Docker distintos:

1.  **Backend (.NET API):** Um contêiner para a API backend.
2.  **Frontend (Blazor & React):** Um contêiner servindo as aplicações frontend (a aplicação de desktop Blazor e a aplicação mobile PWA React).
3.  **Banco de Dados (MongoDB):** Um contêiner dedicado para a instância do MongoDB.

### 🔒 Rede e Segurança

*   **Proxy Reverso:** O Nginx atuará como um proxy reverso, direcionando o tráfego externo para os serviços apropriados.
*   **Acesso Externo:** Apenas o contêiner do Frontend será exposto à internet através de portas específicas configuradas no servidor de nuvem.
*   **Comunicação Interna:** A API e o Banco de Dados não serão acessíveis publicamente. A comunicação entre os contêineres (Frontend -> Backend -> Banco de Dados) ocorrerá em uma rede Docker privada, garantindo a segurança dos dados e da lógica de negócio.

### 📊 Provedores de Nuvem Avaliados

A tabela abaixo resume os provedores de nuvem considerados para a hospedagem do projeto:

| Provedor           | Status    | Custo/Mês  | Recursos | Observações           |
| ------------------ | --------- | ---------- | -------- | --------------------- |
| 🟢 **Oracle Cloud** | ✅ Testado | **Grátis** | 1GB RAM  | Always Free Tier      |
| 🟢 **Hostinger**    | ✅ Testado | $8         | 2GB RAM  | Boa performance       |
| 🟢 **DigitalOcean** | ✅ Testado | $12        | 2GB RAM  | Documentação excelente|
| 🟢 **Microsoft Azure**| ✅ Testado | $14        | 2GB RAM  | Integração Microsoft  |
| 🟢 **AWS EC2**      | ✅ Testado | $17        | 2GB RAM  | Mais recursos         |
| 🟢 **Google Cloud** | ✅ Testado | $15        | 2GB RAM  | Créditos iniciais     |
| 🟢 **Vultr**        | ✅ Testado | $12        | 2GB RAM  | Performance sólida    |
| 🟢 **Linode**       | ✅ Testado | $12        | 2GB RAM  | Suporte excelente     |

## 📂 Estrutura do Projeto

A estrutura de pastas do projeto foi desenhada para separar claramente as responsabilidades, seguindo os princípios da Clean Architecture.

```
/BarbeariaSaaS/
|
├── .git/                                          # Controle de versão Git
├── MaterialDesign/                                # Mockups e designs das interfaces
|   ├── BarbeariaMobile/                          # Designs mobile (17 arquivos PNG)
|   └── BardeariaDesktop/                         # Designs desktop (10 arquivos PNG)
├── src/                                          # Código fonte da aplicação
|   ├── Api/                                      # Backend .NET Core 8
|   |   ├── Core/                                 # Camada de domínio e aplicação
|   |   |   ├── Barbearia.Domain/                # Entidades, agregados e regras de negócio
|   |   |   └── Barbearia.Application/           # Casos de uso e serviços de aplicação
|   |   ├── Infrastructure/                       # Camada de infraestrutura
|   |   |   ├── Barbearia.Infrastructure.Data/   # Acesso a dados MongoDB
|   |   |   └── Barbearia.Infrastructure.Identity/ # Autenticação JWT
|   |   └── Presentation/                         # Camada de apresentação
|   |       └── Barbearia.Api/                   # Controllers e configuração da API
|   ├── Web.Desktop/                              # Aplicação Blazor com MudBlazor
|   ├── Web.Mobile/                               # PWA Angular com Material-UI
|   └── Web.Admin/                                # Dashboard admin SaaS (Blazor)
|
├── tests/                                        # Testes automatizados
|   ├── Api/                                      # Testes do backend
|   |   ├── Barbearia.Domain.Tests/              # Testes unitários do domínio
|   |   └── Barbearia.Application.Tests/         # Testes dos casos de uso
|   ├── Web.Desktop.Tests/                        # Testes da aplicação desktop
|   └── Web.Mobile.Tests/                         # Testes da aplicação mobile
|
├── docs/                                         # Documentação adicional
├── specs/                                        # Especificações e requisitos
├── .gitignore                                    # Arquivos ignorados pelo Git
├── README.md                                     # Documentação principal do projeto
└── set_gemini_key.bat                           # Script para configurar chave da API Gemini
```

### 🎯 Status Atual do Desenvolvimento

**✅ Completo:**
- Documentação detalhada e arquitetura definida
- Material Design com mockups visuais completos
- Estrutura de pastas organizada seguindo Clean Architecture
- Análise de provedores cloud realizada

**🔄 Em Desenvolvimento:**
- Implementação das entidades do domínio (Tenant, Agendamento, Cliente)
- Desenvolvimento da infraestrutura de dados MongoDB
- Criação da API backend com autenticação JWT
- Desenvolvimento das aplicações frontend (Desktop, Mobile, Admin)
- Implementação dos testes automatizados

## 🚀 Como Começar

### Pré-requisitos
- .NET 8.0 SDK
- Node.js 18+ (para Angular)
- MongoDB 7.0+
- Docker & Docker Compose
- Visual Studio 2022 ou VS Code

### Configuração do Ambiente
```bash
# Clone o repositório
git clone <repository-url>
cd BarbeariaSaaS

# Configure a chave da API Gemini (se necessário)
.\set_gemini_key.bat

# Restaurar dependências .NET (quando implementado)
dotnet restore src/

# Instalar dependências Node.js (quando implementado)
npm install --prefix src/Web.Mobile/
```

### Executando o Projeto
```bash
# Subir MongoDB via Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Executar API (quando implementado)
dotnet run --project src/Api/Presentation/Barbearia.Api/

# Executar aplicação Desktop (quando implementado)
dotnet run --project src/Web.Desktop/

# Executar aplicação Mobile (quando implementado)
cd src/Web.Mobile && ng serve
```

## 📞 Contato e Contribuição

Para dúvidas, sugestões ou contribuições, entre em contato através dos canais apropriados do projeto.

---

**Desenvolvido com ❤️ para revolucionar o mercado de barbearias**