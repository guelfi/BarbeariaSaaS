## Prompt de Análise e Reestruturação do Projeto BarbeariaSaaS

Este prompt detalha as etapas para realizar uma análise aprofundada do projeto BarbeariaSaaS e, posteriormente, reestruturar os projetos front-end.

### Fase 1: Análise Aprofundada do Projeto

1.  **Análise da Arquitetura e Stack Tecnológica:**
    *   Ler e analisar o arquivo `ArquiteturaProjeto.md` na raiz do projeto para compreender a arquitetura, padrões de design e a stack de tecnologias propostas.

2.  **Análise das Orientações Gerais e LGPD:**
    *   Ler e analisar os arquivos `README.md` e `LGPD-README.md` na raiz do projeto para entender as orientações gerais do projeto e as diretrizes de aplicação da LGPD.

3.  **Análise dos Requisitos e Design das Telas de Login:**
    *   Ler e analisar os arquivos localizados em `/specs/login-screens/`:
        *   `requirements.md`: Para entender os requisitos funcionais das telas de login.
        *   `design.md`: Para compreender o design e a interface das telas de login.
        *   `tasks.md`: Para verificar as tarefas pendentes ou já realizadas relacionadas às telas de login.

4.  **Análise dos Wireframes e Material Design:**
    *   Reconhecer a existência dos wireframes em formato `.png` nas pastas `/MaterialDesign/BarbeariaMobile` e `/MaterialDesign/BarbeariaDesktop`. (Nota: Uma ferramenta de IA anterior supostamente utilizou essas imagens para gerar os projetos atuais).

5.  **Avaliação do Estado Atual dos Projetos em `/src`:**
    *   Verificar o estado atual da pasta `/src`:
        *   `Api/`: Confirmar que não há desenvolvimento significativo.
        *   `Web.Admin/`: Confirmar que é um projeto Blazor incompleto e que não está iniciando corretamente.
        *   `Web.Desktop/` e `Web.Mobile/`: Confirmar que são projetos Angular incompletos e que não estão iniciando corretamente.

6.  **Geração de Documento de Análise (Opcional):**
    *   Se necessário, consolidar as descobertas da análise em um documento sumarizado.

### Fase 2: Reestruturação dos Projetos Front-end

1.  **Limpeza e Reestruturação do Diretório `/src`:**
    *   Remover completamente todo o conteúdo do diretório `/src`.
    *   Recriar a estrutura de diretórios dentro de `/src` conforme definido no `ArquiteturaProjeto.md` atualizado, incluindo as pastas para `Api`, `Web.Admin`, `Web.Desktop` e `Web.Mobile`, e suas respectivas subpastas para código, assets, estilos, etc.

2.  **Inicialização dos Projetos Front-end:**
    *   **Web.Admin:** Re-inicializar o projeto Blazor Server. (Isso pode envolver a criação de um novo projeto Blazor e a cópia de arquivos de configuração básicos, ou a restauração de um template Blazor).
    *   **Web.Desktop:** Inicializar um novo projeto React com Vite na pasta `src/Web.Desktop`.
    *   **Web.Mobile:** Inicializar um novo projeto React com Vite na pasta `src/Web.Mobile`.

3.  **Verificação da Inicialização:**
    *   Após a criação, verificar se os novos projetos podem ser iniciados e executados sem erros básicos.

### Próximos Passos

Após a conclusão destas fases, o projeto estará pronto para o desenvolvimento com a nova stack tecnológica.

---
**Lembrete:** O usuário prefere realizar o `git push` manualmente e deve ser lembrado de fazê-lo em pontos de verificação importantes do projeto.