describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.get('[data-cy=email]').should('be.visible')
    cy.get('[data-cy=password]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible')
  })

  it('should login with valid credentials', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-cy=email]').type(users.admin.email)
      cy.get('[data-cy=password]').type(users.admin.password)
      cy.get('[data-cy=login-button]').click()
      
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy=user-menu]').should('contain', users.admin.email)
    })
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-cy=email]').type('invalid@email.com')
    cy.get('[data-cy=password]').type('wrongpassword')
    cy.get('[data-cy=login-button]').click()
    
    cy.get('[data-cy=error-message]').should('be.visible')
    cy.get('[data-cy=error-message]').should('contain', 'Credenciais inválidas')
  })
})