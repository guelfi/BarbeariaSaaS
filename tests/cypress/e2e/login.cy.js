describe('Fluxos de Login Multi-Frontend', () => {
  
  describe('Web.Admin - Login Administrativo', () => {
    beforeEach(() => {
      cy.visit('/admin/login')
    })

    it('deve exibir formulário de login administrativo', () => {
      cy.get('[data-cy=admin-email]').should('be.visible')
      cy.get('[data-cy=admin-password]').should('be.visible')
      cy.get('[data-cy=admin-login-button]').should('be.visible')
      cy.get('[data-cy=admin-logo]').should('be.visible')
      cy.contains('Admin Dashboard').should('be.visible')
    })

    it('deve fazer login com credenciais de administrador válidas', () => {
      cy.fixture('users').then((users) => {
        cy.get('[data-cy=admin-email]').type(users.admin.email)
        cy.get('[data-cy=admin-password]').type(users.admin.password)
        cy.get('[data-cy=admin-login-button]').click()
        
        cy.url().should('include', '/admin/development')
        cy.get('[data-cy=admin-user-info]').should('contain', users.admin.name)
        cy.get('[data-cy=admin-logout-button]').should('be.visible')
      })
    })

    it('deve mostrar erro com credenciais inválidas', () => {
      cy.get('[data-cy=admin-email]').type('admin@invalido.com')
      cy.get('[data-cy=admin-password]').type('senhaerrada')
      cy.get('[data-cy=admin-login-button]').click()
      
      cy.get('[data-cy=admin-error-message]').should('be.visible')
      cy.get('[data-cy=admin-error-message]').should('contain', 'Credenciais inválidas')
    })

    it('deve validar campos obrigatórios', () => {
      cy.get('[data-cy=admin-login-button]').click()
      cy.get('[data-cy=admin-email-error]').should('contain', 'Email é obrigatório')
      cy.get('[data-cy=admin-password-error]').should('contain', 'Senha é obrigatória')
    })

    it('deve alternar visibilidade da senha', () => {
      cy.get('[data-cy=admin-password]').should('have.attr', 'type', 'password')
      cy.get('[data-cy=admin-password-toggle]').click()
      cy.get('[data-cy=admin-password]').should('have.attr', 'type', 'text')
    })

    it('deve fazer logout corretamente', () => {
      cy.fixture('users').then((users) => {
        cy.login(users.admin.email, users.admin.password, 'admin')
        cy.visit('/admin/development')
        cy.get('[data-cy=admin-logout-button]').click()
        cy.url().should('include', '/admin/login')
      })
    })
  })

  describe('Web.Desktop - Login Barbearia', () => {
    beforeEach(() => {
      cy.visit('/desktop/login')
    })

    it('deve exibir formulário de login da barbearia', () => {
      cy.get('[data-cy=desktop-email]').should('be.visible')
      cy.get('[data-cy=desktop-password]').should('be.visible')
      cy.get('[data-cy=desktop-login-button]').should('be.visible')
      cy.get('[data-cy=desktop-register-link]').should('be.visible')
      cy.contains('Barbearia SaaS').should('be.visible')
    })

    it('deve fazer login com credenciais de barbeiro válidas', () => {
      cy.fixture('users').then((users) => {
        cy.get('[data-cy=desktop-email]').type(users.barbeiro.email)
        cy.get('[data-cy=desktop-password]').type(users.barbeiro.password)
        cy.get('[data-cy=desktop-login-button]').click()
        
        cy.url().should('include', '/desktop/development')
        cy.get('[data-cy=desktop-user-info]').should('contain', users.barbeiro.name)
      })
    })

    it('deve navegar para cadastro de barbearia', () => {
      cy.get('[data-cy=desktop-register-link]').click()
      cy.url().should('include', '/desktop/register')
      cy.get('[data-cy=register-barbearia-form]').should('be.visible')
    })

    it('deve mostrar animações de entrada', () => {
      cy.get('[data-cy=desktop-branding]').should('have.class', 'animate-slide-left')
      cy.get('[data-cy=desktop-form-container]').should('have.class', 'animate-slide-right')
    })

    it('deve ser responsivo em diferentes tamanhos de tela', () => {
      // Desktop
      cy.viewport(1280, 720)
      cy.get('[data-cy=desktop-branding]').should('be.visible')
      
      // Tablet
      cy.viewport(768, 1024)
      cy.get('[data-cy=desktop-branding]').should('be.visible')
      
      // Mobile
      cy.viewport(375, 667)
      cy.get('[data-cy=desktop-form-container]').should('be.visible')
    })
  })

  describe('Web.Mobile - Login Cliente PWA', () => {
    beforeEach(() => {
      cy.visit('/mobile/login')
      cy.viewport(375, 667) // iPhone SE
    })

    it('deve exibir formulário de login mobile', () => {
      cy.get('[data-cy=mobile-email]').should('be.visible')
      cy.get('[data-cy=mobile-password]').should('be.visible')
      cy.get('[data-cy=mobile-login-button]').should('be.visible')
      cy.get('[data-cy=mobile-register-link]').should('be.visible')
      cy.get('[data-cy=mobile-barbearia-selector]').should('be.visible')
    })

    it('deve fazer login com credenciais de cliente válidas', () => {
      cy.fixture('users').then((users) => {
        cy.get('[data-cy=mobile-email]').type(users.cliente.email)
        cy.get('[data-cy=mobile-password]').type(users.cliente.password)
        cy.get('[data-cy=mobile-login-button]').click()
        
        cy.url().should('include', '/mobile/development')
        cy.get('[data-cy=mobile-user-info]').should('contain', users.cliente.name)
      })
    })

    it('deve abrir seletor de barbearia', () => {
      cy.get('[data-cy=mobile-barbearia-selector]').click()
      cy.get('[data-cy=barbearia-list]').should('be.visible')
      cy.get('[data-cy=barbearia-item]').should('have.length.greaterThan', 0)
    })

    it('deve navegar para cadastro de cliente', () => {
      cy.get('[data-cy=mobile-register-link]').click()
      cy.url().should('include', '/mobile/register')
      cy.get('[data-cy=register-cliente-form]').should('be.visible')
    })

    it('deve funcionar com gestos touch', () => {
      cy.get('[data-cy=mobile-password-toggle]').click()
      cy.get('[data-cy=mobile-password]').should('have.attr', 'type', 'text')
    })

    it('deve mostrar indicador offline quando necessário', () => {
      cy.window().then((win) => {
        // Simular modo offline
        cy.stub(win.navigator, 'onLine').value(false)
        cy.reload()
        cy.get('[data-cy=offline-indicator]').should('be.visible')
        cy.get('[data-cy=offline-indicator]').should('contain', 'Modo Offline')
      })
    })

    it('deve funcionar em diferentes orientações', () => {
      // Portrait
      cy.viewport(375, 667)
      cy.get('[data-cy=mobile-login-card]').should('be.visible')
      
      // Landscape
      cy.viewport(667, 375)
      cy.get('[data-cy=mobile-login-card]').should('be.visible')
    })
  })

  describe('Cadastros', () => {
    it('deve cadastrar nova barbearia (Desktop)', () => {
      cy.visit('/desktop/register')
      
      cy.get('[data-cy=barbearia-nome]').type('Barbearia Teste')
      cy.get('[data-cy=barbearia-email]').type('teste@barbearia.com')
      cy.get('[data-cy=barbearia-senha]').type('MinhaSenh@123')
      cy.get('[data-cy=barbearia-confirmar-senha]').type('MinhaSenh@123')
      cy.get('[data-cy=barbearia-telefone]').type('(11) 99999-9999')
      cy.get('[data-cy=barbearia-endereco]').type('Rua Teste, 123')
      
      cy.get('[data-cy=register-barbearia-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Cadastro realizado com sucesso')
      cy.url().should('include', '/desktop/login')
    })

    it('deve cadastrar novo cliente (Mobile)', () => {
      cy.visit('/mobile/register')
      cy.viewport(375, 667)
      
      cy.get('[data-cy=cliente-nome]').type('Cliente Teste')
      cy.get('[data-cy=cliente-email]').type('cliente@teste.com')
      cy.get('[data-cy=cliente-senha]').type('MinhaSenh@123')
      cy.get('[data-cy=cliente-confirmar-senha]').type('MinhaSenh@123')
      cy.get('[data-cy=cliente-telefone]').type('(11) 88888-8888')
      
      cy.get('[data-cy=register-cliente-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Cadastro realizado com sucesso')
      cy.url().should('include', '/mobile/development')
    })

    it('deve validar senhas que não coincidem', () => {
      cy.visit('/desktop/register')
      
      cy.get('[data-cy=barbearia-senha]').type('MinhaSenh@123')
      cy.get('[data-cy=barbearia-confirmar-senha]').type('SenhaDiferente')
      cy.get('[data-cy=register-barbearia-button]').click()
      
      cy.get('[data-cy=password-mismatch-error]').should('contain', 'Senhas não coincidem')
    })
  })

  describe('Validações e Mensagens em Português', () => {
    it('deve exibir todas as mensagens em português', () => {
      cy.visit('/admin/login')
      
      // Testar mensagens de validação
      cy.get('[data-cy=admin-login-button]').click()
      cy.get('[data-cy=admin-email-error]').should('contain', 'obrigatório')
      cy.get('[data-cy=admin-password-error]').should('contain', 'obrigatória')
      
      // Testar mensagem de erro de login
      cy.get('[data-cy=admin-email]').type('teste@teste.com')
      cy.get('[data-cy=admin-password]').type('senhaerrada')
      cy.get('[data-cy=admin-login-button]').click()
      
      cy.get('[data-cy=admin-error-message]').should('contain', 'inválidas')
      
      // Verificar que não há mensagens em inglês
      cy.get('body').should('not.contain', 'Invalid')
      cy.get('body').should('not.contain', 'Required')
      cy.get('body').should('not.contain', 'Error')
    })
  })

  describe('Performance e Acessibilidade', () => {
    it('deve carregar rapidamente', () => {
      const start = Date.now()
      cy.visit('/desktop/login')
      cy.get('[data-cy=desktop-login-button]').should('be.visible').then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(3000) // Menos de 3 segundos
      })
    })

    it('deve ser navegável por teclado', () => {
      cy.visit('/admin/login')
      
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-cy', 'admin-email')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-cy', 'admin-password')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-cy', 'admin-password-toggle')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-cy', 'admin-login-button')
    })

    it('deve ter labels apropriados para screen readers', () => {
      cy.visit('/mobile/login')
      
      cy.get('[data-cy=mobile-email]').should('have.attr', 'aria-label')
      cy.get('[data-cy=mobile-password]').should('have.attr', 'aria-label')
      cy.get('[data-cy=mobile-password-toggle]').should('have.attr', 'aria-label')
    })
  })

  describe('Fluxos Completos End-to-End', () => {
    it('deve completar fluxo completo: cadastro → login → logout (Desktop)', () => {
      // Cadastro
      cy.visit('/desktop/register')
      cy.get('[data-cy=barbearia-nome]').type('Barbearia E2E')
      cy.get('[data-cy=barbearia-email]').type('e2e@barbearia.com')
      cy.get('[data-cy=barbearia-senha]').type('E2ESenh@123')
      cy.get('[data-cy=barbearia-confirmar-senha]').type('E2ESenh@123')
      cy.get('[data-cy=barbearia-telefone]').type('(11) 77777-7777')
      cy.get('[data-cy=barbearia-endereco]').type('Rua E2E, 123')
      cy.get('[data-cy=register-barbearia-button]').click()
      
      // Login automático após cadastro
      cy.url().should('include', '/desktop/development')
      
      // Logout
      cy.get('[data-cy=desktop-logout-button]').click()
      cy.url().should('include', '/desktop/login')
    })

    it('deve completar fluxo completo: seleção barbearia → cadastro → login (Mobile)', () => {
      cy.visit('/mobile/login')
      cy.viewport(375, 667)
      
      // Selecionar barbearia
      cy.get('[data-cy=mobile-barbearia-selector]').click()
      cy.get('[data-cy=barbearia-item]').first().click()
      
      // Ir para cadastro
      cy.get('[data-cy=mobile-register-link]').click()
      
      // Cadastrar cliente
      cy.get('[data-cy=cliente-nome]').type('Cliente E2E')
      cy.get('[data-cy=cliente-email]').type('clientee2e@teste.com')
      cy.get('[data-cy=cliente-senha]').type('ClienteE2E@123')
      cy.get('[data-cy=cliente-confirmar-senha]').type('ClienteE2E@123')
      cy.get('[data-cy=cliente-telefone]').type('(11) 66666-6666')
      cy.get('[data-cy=register-cliente-button]').click()
      
      // Verificar login automático
      cy.url().should('include', '/mobile/development')
      cy.get('[data-cy=mobile-user-info]').should('contain', 'Cliente E2E')
    })
  })
})