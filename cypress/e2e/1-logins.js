describe('Claim new user name', () => {
  if (!Cypress.config().skipInitTests) {
    it('logs in new user', () => {
      /*
        this will be the first address in the list;
        can be changed to further order in the list if the test needs to be repeated
      */
      cy.claimNewUserName(0);

      cy.url().should('be.equal', 'http://localhost:9090/landing');
    });
  }
});

describe('Colony dapp landing simple login', () => {
  it('logins the existing account', () => {
    cy.login();
    cy.findByText(/connect wallet/i)
      .should('not.exist')
      .assertHome();
  });
});
