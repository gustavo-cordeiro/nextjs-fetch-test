describe('template spec', () => {
  it('A not Logged User cant Access the App', () => {
    cy.visit('/');
    cy.origin('api.producthunt.com', () => {
      cy.url().should('include', '/v2/login')
    })
  })
  it('A logged User Must Access the App', () => {
    cy.visit('/', {
      onBeforeLoad: (contentWindow) => {
        contentWindow.localStorage.setItem('token', Cypress.env('dev_token'))
      },
    });
    cy.url().should('include', '?panel=RANKING');
  })
})