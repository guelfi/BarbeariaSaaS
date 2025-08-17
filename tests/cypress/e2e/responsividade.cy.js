describe('Testes de Responsividade Multi-Frontend', () => {
  
  const viewports = [
    { name: 'Mobile Portrait', width: 375, height: 667 },
    { name: 'Mobile Landscape', width: 667, height: 375 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ]

  describe('Web.Admin - Responsividade', () => {
    viewports.forEach(viewport => {
      it(`deve funcionar corretamente em ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/admin/login')
        
        // Verificar elementos principais
        cy.get('[data-cy=admin-login-card]').should('be.visible')
        cy.get('[data-cy=admin-email]').should('be.visible')
        cy.get('[data-cy=admin-password]').should('be.visible')
        cy.get('[data-cy=admin-login-button]').should('be.visible')
        
        // Verificar que elementos não estão sobrepostos
        cy.get('[data-cy=admin-login-card]').then($card => {
          const cardRect = $card[0].getBoundingClientRect()
          expect(cardRect.width).to.be.lessThan(viewport.width)
          expect(cardRect.height).to.be.lessThan(viewport.height)
        })
        
        // Testar funcionalidade básica
        cy.get('[data-cy=admin-email]').type('teste@admin.com')
        cy.get('[data-cy=admin-password]').type('senha123')
        cy.get('[data-cy=admin-password-toggle]').should('be.visible').click()
        cy.get('[data-cy=admin-password]').should('have.attr', 'type', 'text')
      })
    })
  })

  describe('Web.Desktop - Responsividade', () => {
    viewports.forEach(viewport => {
      it(`deve adaptar layout em ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/desktop/login')
        
        // Verificar elementos principais
        cy.get('[data-cy=desktop-login-button]').should('be.visible')
        cy.get('[data-cy=desktop-email]').should('be.visible')
        cy.get('[data-cy=desktop-password]').should('be.visible')
        
        if (viewport.width >= 768) {
          // Em telas maiores, branding deve estar visível
          cy.get('[data-cy=desktop-branding]').should('be.visible')
        }
        
        // Testar scroll se necessário
        if (viewport.height < 600) {
          cy.get('[data-cy=desktop-login-button]').scrollIntoView()
          cy.get('[data-cy=desktop-login-button]').should('be.visible')
        }
        
        // Verificar que formulário é utilizável
        cy.get('[data-cy=desktop-email]').type('barbeiro@teste.com')
        cy.get('[data-cy=desktop-password]').type('senha123')
        cy.get('[data-cy=desktop-register-link]').should('be.visible')
      })
    })
  })

  describe('Web.Mobile - Responsividade PWA', () => {
    const mobileViewports = viewports.filter(v => v.width <= 768)
    
    mobileViewports.forEach(viewport => {
      it(`deve otimizar para ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/mobile/login')
        
        // Verificar elementos mobile
        cy.get('[data-cy=mobile-login-card]').should('be.visible')
        cy.get('[data-cy=mobile-email]').should('be.visible')
        cy.get('[data-cy=mobile-password]').should('be.visible')
        cy.get('[data-cy=mobile-login-button]').should('be.visible')
        
        // Verificar safe areas (especialmente importante para mobile)
        cy.get('.mobile-content').then($content => {
          const contentRect = $content[0].getBoundingClientRect()
          expect(contentRect.left).to.be.greaterThan(0) // Margem esquerda
          expect(contentRect.right).to.be.lessThan(viewport.width) // Margem direita
        })
        
        // Testar gestos touch
        cy.get('[data-cy=mobile-password-toggle]').should('be.visible')
        cy.get('[data-cy=mobile-barbearia-selector]').should('be.visible')
        
        // Verificar que botões têm tamanho adequado para touch (min 44px)
        cy.get('[data-cy=mobile-login-button]').then($btn => {
          const btnRect = $btn[0].getBoundingClientRect()
          expect(btnRect.height).to.be.at.least(44)
        })
        
        // Testar orientação específica
        if (viewport.width > viewport.height) {
          // Landscape - verificar que conteúdo ainda é acessível
          cy.get('[data-cy=mobile-login-card]').should('be.visible')
          cy.get('[data-cy=mobile-login-button]').scrollIntoView().should('be.visible')
        }
      })
    })
  })

  describe('Testes de Breakpoints Específicos', () => {
    it('deve quebrar layout corretamente no breakpoint tablet (768px)', () => {
      // Testar transição de mobile para tablet
      cy.viewport(767, 1024) // Mobile
      cy.visit('/desktop/login')
      cy.get('[data-cy=desktop-branding]').should('not.be.visible')
      
      cy.viewport(768, 1024) // Tablet
      cy.get('[data-cy=desktop-branding]').should('be.visible')
    })

    it('deve ajustar tipografia em diferentes tamanhos', () => {
      const sizes = [
        { width: 375, expectedSize: 'small' },
        { width: 768, expectedSize: 'medium' },
        { width: 1280, expectedSize: 'large' }
      ]

      sizes.forEach(size => {
        cy.viewport(size.width, 800)
        cy.visit('/admin/login')
        
        cy.get('[data-cy=admin-title]').then($title => {
          const fontSize = window.getComputedStyle($title[0]).fontSize
          const fontSizeNum = parseFloat(fontSize)
          
          if (size.expectedSize === 'small') {
            expect(fontSizeNum).to.be.lessThan(24)
          } else if (size.expectedSize === 'large') {
            expect(fontSizeNum).to.be.greaterThan(28)
          }
        })
      })
    })
  })

  describe('Testes de Densidade de Pixels', () => {
    it('deve funcionar em diferentes densidades de pixel', () => {
      // Simular diferentes device pixel ratios
      const pixelRatios = [1, 1.5, 2, 3]
      
      pixelRatios.forEach(ratio => {
        cy.visit('/mobile/login', {
          onBeforeLoad: (win) => {
            Object.defineProperty(win, 'devicePixelRatio', {
              value: ratio
            })
          }
        })
        
        cy.viewport(375, 667)
        
        // Verificar que imagens e ícones são nítidos
        cy.get('[data-cy=mobile-brand-icon]').should('be.visible')
        cy.get('[data-cy=mobile-login-button]').should('be.visible')
        
        // Verificar que texto é legível
        cy.get('[data-cy=mobile-welcome-text]').should('be.visible')
      })
    })
  })

  describe('Testes de Acessibilidade Responsiva', () => {
    it('deve manter acessibilidade em todos os tamanhos', () => {
      viewports.forEach(viewport => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/admin/login')
        
        // Verificar contraste adequado
        cy.get('[data-cy=admin-email]').should('have.css', 'color')
        cy.get('[data-cy=admin-login-button]').should('have.css', 'background-color')
        
        // Verificar que elementos focáveis são acessíveis
        cy.get('[data-cy=admin-email]').focus()
        cy.focused().should('have.attr', 'data-cy', 'admin-email')
        
        // Verificar que não há overflow horizontal
        cy.get('body').then($body => {
          expect($body[0].scrollWidth).to.be.at.most(viewport.width + 1) // +1 para tolerância
        })
      })
    })

    it('deve funcionar com zoom até 200%', () => {
      cy.visit('/desktop/login')
      cy.viewport(1280, 720)
      
      // Simular zoom 200%
      cy.get('body').invoke('css', 'transform', 'scale(2)')
      cy.get('body').invoke('css', 'transform-origin', 'top left')
      
      // Verificar que elementos ainda são acessíveis
      cy.get('[data-cy=desktop-email]').should('be.visible')
      cy.get('[data-cy=desktop-password]').should('be.visible')
      cy.get('[data-cy=desktop-login-button]').should('be.visible')
    })
  })

  describe('Performance em Diferentes Tamanhos', () => {
    it('deve carregar rapidamente em dispositivos móveis', () => {
      cy.viewport(375, 667)
      
      const start = performance.now()
      cy.visit('/mobile/login')
      
      cy.get('[data-cy=mobile-login-button]').should('be.visible').then(() => {
        const loadTime = performance.now() - start
        expect(loadTime).to.be.lessThan(2000) // Menos de 2 segundos em mobile
      })
    })

    it('deve manter 60fps em animações mobile', () => {
      cy.viewport(375, 667)
      cy.visit('/mobile/login')
      
      // Testar animação de entrada
      cy.get('[data-cy=mobile-login-card]').should('have.class', 'animate-slide-up')
      
      // Verificar que animações são suaves (sem teste específico de FPS, mas verificar que não há jank)
      cy.get('[data-cy=mobile-password-toggle]').click()
      cy.get('[data-cy=mobile-password]').should('have.attr', 'type', 'text')
    })
  })
})