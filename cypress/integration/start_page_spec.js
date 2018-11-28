describe('The Home Page', function() {
  it('successfully loads, and redirects to /connect', function() {
    cy.visit('/')
    cy.url().should('include', '/connect')
  })
  it('contains a button to create a wallet, which changes the page', function() {
    cy.get('[data-test="createWalletLink"]').click()
    cy.url().should('include', '/create-wallet')
  })
})
