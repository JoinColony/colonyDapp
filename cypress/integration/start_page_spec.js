describe('The Home Page', () => {
  it('successfully loads, and redirects to /connect', () => {
    cy.visit('/');
    cy.url().should('include', '/connect');
  });

  it('contains a button to create a wallet, which changes the page', () => {
    cy.get('[data-test="createWalletLink"]').click();
    cy.url().should('include', '/create-wallet');
  });
});
