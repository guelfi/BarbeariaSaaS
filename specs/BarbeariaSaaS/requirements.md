# Requisitos de Telas e Fluxos - SaaS para Barbearias

Este documento detalha os requisitos funcionais para as telas e fluxos de usuário da plataforma SaaS para Barbearias, com base na análise das imagens de design para as versões Mobile e Desktop.

## 1. Visão Geral e Personas

O sistema atende a duas personas principais:

-   **Cliente:** Pessoa que busca e agenda serviços em barbearias.
-   **Dono/Gerente da Barbearia:** Administra o perfil da sua barbearia, serviços e agendamentos (persona inferida, telas não fornecidas).

## 2. Requisitos Funcionais Globais

-   **Design Responsivo:** A interface deve se adaptar de forma fluida entre os layouts de Desktop e Mobile.
-   **Autenticação de Usuário:**
    -   [ ] Fluxo de Login/Logout para Clientes.
    -   [ ] Fluxo de Cadastro de novos Clientes.
    -   [ ] (Inferido) Sistema de autenticação para proprietários de barbearias.

## 3. Fluxo do Cliente

### 3.1. Tela Inicial (Home)

**Objetivo:** Apresentar ao cliente uma visão geral dos serviços, barbearias populares e seus agendamentos.

**Componentes:**
-   **Cabeçalho:**
    -   **Mobile:** Menu hambúrguer e logo.
    -   **Desktop:** Logo, campo de busca, link para "Agendamentos" e perfil do usuário.
-   **Boas-vindas:** Mensagem de saudação para usuários logados (e.g., "Olá, Miguel!").
-   **Busca Rápida:**
    -   Campo de busca principal.
    -   **Mobile:** Filtros rápidos por tipo de serviço (Cabelo, Barba, etc.).
-   **Banner Promocional:** Espaço para destaque de promoções ou novidades.
-   **Seção "Agendamentos":**
    -   Exibe o próximo agendamento confirmado do usuário.
    -   Card com nome do serviço, nome da barbearia, data e hora.
-   **Listas de Barbearias:**
    -   Carrosséis horizontais para "Recomendados", "Populares" e "Mais Visitados".
    -   Cada item é um "Card de Barbearia".
-   **Card de Barbearia:**
    -   Imagem da barbearia.
    -   Nome da barbearia.
    -   Endereço.
    -   Nota de avaliação (e.g., 5.0 estrelas).
    -   Botão "Reservar".

### 3.2. Busca

**Objetivo:** Permitir que o cliente encontre barbearias pelo nome.

**Componentes:**
-   Campo de texto para inserir o nome da barbearia.
-   Botão de busca.
-   **Tela de Resultados:**
    -   Exibe o termo buscado (e.g., "Resultados para 'Vintage Barber'").
    -   Lista de "Cards de Barbearia" que correspondem à busca.

### 3.3. Perfil da Barbearia

**Objetivo:** Fornecer informações detalhadas sobre uma barbearia e os serviços que ela oferece.

**Componentes:**
-   Imagem de destaque da barbearia.
-   Nome, endereço e nota de avaliação.
-   Seção "Sobre Nós" com texto descritivo.
-   **Lista de Serviços:**
    -   Cada serviço contém: imagem, nome, descrição e preço.
    -   Botão "Reservar" para cada serviço.
-   **Informações de Contato:**
    -   Telefones com botão para "Copiar".
-   **Horário de Funcionamento:**
    -   Lista dos dias da semana com seus respectivos horários.
-   **Mapa:**
    -   Componente de mapa interativo mostrando a localização da barbearia.

### 3.4. Fluxo de Agendamento

**Objetivo:** Guiar o cliente na criação de uma nova reserva de serviço.

**Etapas:**
1.  **Seleção do Serviço:** O fluxo é iniciado ao clicar em "Reservar" na tela de perfil da barbearia ou em um card de barbearia.
2.  **Painel/Modal "Fazer Reserva":**
    -   Exibe o serviço selecionado e o preço.
    -   **Calendário:** Permite a seleção do dia.
    -   **Seleção de Horário:** Exibe os horários disponíveis para o dia selecionado.
    -   **Resumo da Reserva:** Mostra o serviço, data, horário e nome da barbearia.
3.  **Confirmação:**
    -   Botão "Confirmar" para finalizar o agendamento.
    -   Após a confirmação, um pop-up de sucesso é exibido ("Reserva Efetuada!").

### 3.5. Tela de Agendamentos

**Objetivo:** Permitir que o cliente visualize e gerencie seus agendamentos.

**Componentes:**
-   **Listas separadas:**
    -   **Confirmados:** Agendamentos futuros.
    -   **Finalizados:** Histórico de agendamentos passados.
-   **Card de Agendamento:**
    -   Mostra o status ("Confirmado" ou "Finalizado").
    -   Nome do serviço, nome da barbearia, data e hora.
-   **Detalhes do Agendamento (Desktop):**
    -   Ao selecionar um agendamento, uma área de detalhes exibe o mapa, informações da barbearia e um botão para **"Cancelar Reserva"**.
-   **Modal de Cancelamento:**
    -   Ao clicar em "Cancelar Reserva", um modal de confirmação é exibido para evitar cancelamentos acidentais.

### 3.6. Menu de Navegação (Mobile)

**Objetivo:** Fornecer acesso rápido às principais seções do aplicativo.

**Componentes:**
-   Acessado pelo ícone de menu hambúrguer.
-   Exibe o status de login do usuário ("Olá. Faça seu login!" ou nome/email do usuário).
-   **Links de Navegação:**
    -   Início
    -   Agendamentos
    -   Categorias de serviço (Cabelo, Barba, etc.)
    -   Login / Sair da conta.
