# Plano de Tarefas - Build e Validação do Web.Mobile

Este documento detalha as tarefas passo a passo para corrigir os problemas de build e preparar o projeto Web.Mobile para validação de UI/UX com dados mockados. As tarefas estão ordenadas para minimizar dependências e erros em cascata.

## 1. Correções de Configuração e Estrutura

- [ ] 1.1 **Verificar e corrigir `main.ts`:**
    - **Status:** Criado em `src/Web.Mobile/src/main.ts`.
    - **Ação:** Nenhuma ação adicional necessária, apenas verificação.
    - _Referência:_ `design.md` - "Verificação de `main.ts`"

- [ ] 1.2 **Ajustar caminhos de importação SCSS:**
    - **Status:** Corrigido para usar `abstracts/_variables` e `abstracts/_mixins` diretamente.
    - **Status:** `stylePreprocessorOptions` em `angular.json` configurado para `includePaths: ["styles"]`.
    - **Status:** `main.scss` agora importado em `app.component.scss`.
    - **Ação:** Nenhuma ação adicional necessária, apenas verificação.

- [ ] 1.3 **Garantir a existência de diretórios e arquivos SCSS essenciais:**
    - **Status:** Diretório `src/Web.Mobile/styles/base/` e seus arquivos (`_base.scss`, `_reset.scss`, `_typography.scss`) foram copiados de `Web.Desktop`.
    - **Status:** Diretório `src/Web.Mobile/styles/layout/` e seus arquivos (`_header.scss`, `_navigation.scss`, `_main.scss`, `_footer.scss`) foram criados como placeholders.
    - **Status:** Diretório `src/Web.Mobile/styles/components/` e seus arquivos (`_buttons.scss`) foram copiados de `Web.Desktop`.
    - **Ação:** Nenhuma ação adicional necessária, apenas verificação.

- [ ] 1.4 **Definir variáveis e mixins SCSS ausentes:**
    - **Status:** Todas as variáveis (`$gray-xxx`, `$error-color`, `$font-family-primary`, `$font-size-base`, `$spacing-md`, `$font-size-4xl`, `$font-size-3xl`, `$font-size-2xl`, `$font-size-xl`, `$font-size-lg`, `$font-size-xs`, `$font-size-sm`, `$spacing-lg`, `$spacing-xs`, `$white`, `$z-fixed`, `$spacing-sm`, `$spacing-xl`, `$border-radius-sm`, `$border-radius-md`, `$border-radius-lg`, `$border-radius-xl`, `$border-radius-2xl`, `$border-radius-full`, `$shadow-sm`, `$shadow-md`, `$shadow-lg`, `$shadow-xl`, `$primary-rgb`, `$accent-rgb`, `$warning-rgb`, `$success-rgb`, `$error-rgb`, `$info-rgb`, `$mobile-primary-rgb`, `$mobile-success-rgb`, `$surface-color`, `$on-surface-color`, `$surface-rgb`, `$on-surface-rgb`, `$elevation-2`, `$elevation-4`) foram adicionadas a `src/Web.Mobile/styles/abstracts/_variables.scss`.
    - **Status:** O mixin `respond-to` e `mobile-only` foram adicionados a `src/Web.Mobile/styles/abstracts/_mixins.scss`.
    - **Ação:** Nenhuma ação adicional necessária, apenas verificação.

## 2. Correções de TypeScript e Módulos

- [ ] 2.1 **Corrigir erros de tipagem em `src/app/core/models/auth.models.ts`:**
    - **Problema:** `RegisterClienteRequest` não possui a propriedade `confirmarSenha`.
    - **Ação:** Adicionar `confirmarSenha?: string;` à interface `RegisterClienteRequest`.
    - **Arquivo:** `src/Web.Mobile/src/app/core/models/auth.models.ts`

- [ ] 2.2 **Corrigir erros de propriedades ausentes em `AuthError`:**
    - **Problema:** `AuthError` não possui `EMAIL_ALREADY_EXISTS` e `VALIDATION_ERROR`.
    - **Ação:** Adicionar `EMAIL_ALREADY_EXISTS = 'email_already_exists',` e `VALIDATION_ERROR = 'validation_error',` ao enum `AuthError`.
    - **Arquivo:** `src/Web.Mobile/src/app/core/models/auth.models.ts`

- [ ] 2.3 **Corrigir erros de propriedades ausentes em `AuthService`:**
    - **Problema:** `AuthService` não possui `validatePhoneNumber`, `validatePasswordStrength`, `loginWithRetry`.
    - **Ação:** Implementar esses métodos na classe `AuthService` em `src/Web.Mobile/src/app/core/services/auth.service.ts`.
        - `validatePhoneNumber(phone: string): boolean` (pode usar `ValidationService.phoneValidator()`)
        - `validatePasswordStrength(password: string): boolean` (pode usar `ValidationService.passwordStrengthValidator()`)
        - `loginWithRetry(credentials: LoginRequest, retries: number): Observable<AuthResult>` (implementar lógica de retry)
    - **Ação:** Garantir que `AuthResult` retorne `success: boolean` e `message?: string` conforme esperado pelos testes.
    - **Arquivo:** `src/Web.Mobile/src/app/core/services/auth.service.ts`

- [ ] 2.4 **Corrigir tipagem implícita `any` em `auth.service.spec.ts`:**
    - **Problema:** Parâmetros como `result` em `subscribe` têm tipo `any`.
    - **Ação:** Adicionar tipagem explícita (ex: `(result: AuthResult) => { ... }`).
    - **Arquivo:** `src/Web.Mobile/src/app/core/services/auth.service.spec.ts`

- [ ] 2.5 **Verificar e adicionar imports de módulos Angular Material:**
    - **Status:** `MatChipsModule` já adicionado a `AuthModule`.
    - **Ação:** Revisar `src/Web.Mobile/src/app/app.module.ts`, `src/Web.Mobile/src/app/shared/shared.module.ts`, `src/Web.Mobile/src/app/features/auth/auth.module.ts`, `src/Web.Mobile/src/app/features/development/development.module.ts` para garantir que todos os módulos Material usados nos templates HTML dos componentes sejam importados.
    - **Observação:** Prestar atenção a componentes como `mat-spinner`, `mat-progress-bar`, `mat-card`, `mat-form-field`, `mat-input`, `mat-icon`, `mat-button`, `mat-snack-bar`, `mat-checkbox`, `mat-divider`, `mat-bottom-sheet`, `mat-list`, `mat-select`, `mat-tooltip`, `mat-toolbar`, `mat-menu`.

- [ ] 2.6 **Corrigir erros de `Module not found` para módulos de feature:**
    - **Status:** Rotas para `barbearias`, `agendamentos`, `perfil` foram comentadas em `app-routing.module.ts`.
    - **Ação:** Nenhuma ação adicional necessária nesta fase, pois o objetivo é o build com dados mockados. Estes módulos serão implementados posteriormente.

## 3. Correções de Templates HTML

- [ ] 3.1 **Tratar erros de escape em templates HTML:**
    - **Status:** Erros `NG5002` em `politica-privacidade.component.ts` e `lgpd-banner.component.html` foram corrigidos (substituindo `@` por `&#64;`).
    - **Ação:** Nenhuma ação adicional necessária, apenas verificação.

## 4. Execução do Build e Verificação Final

- [ ] 4.1 **Executar build do projeto:**
    - **Comando:** `cd src/Web.Mobile/ && npm run build`
    - **Verificação:** O build deve ser concluído com sucesso (0 erros).

- [ ] 4.2 **Verificar avisos de budget:**
    - **Status:** Avisos de budget excedido para vários arquivos SCSS.
    - **Ação:** Estes são avisos e não impedem o build. Serão endereçados em uma fase de otimização de performance, se necessário.

---

**Próximo Passo:** Aguardando sua avaliação e aprovação deste `tasks_web_mobile.md`.
