describe('Create a new colony', () => {
  if (!Cypress.config().skipInitTests) {
    it('creates a new colony with new token', () => {
      const { name, nativeToken } = Cypress.config().colony;

      cy.login();

      cy.createColony(Cypress.config().colony, true);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        nativeToken,
      );

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`);
    });

    it('New user is created which joins the colony', () => {
      /*
        this will be the second address in the list;
        can be changed to further order in the list if the test needs to be repeated
      */
      cy.claimNewUserName(1);

      cy.url().should('be.equal', 'http://localhost:9090/landing');

      cy.visit(`/colony/${Cypress.config().colony.name}`);

      cy.getBySel('joinColonyButton', { timeout: 100000 }).click();

      cy.getBySel('joinColonyButton').should('not.exist');
    });

    it('creates a new colony with existing token', () => {
      const {
        nativeToken: existingToken,
        name: existingColony,
      } = Cypress.config().colony;
      const { name } = Cypress.config().colony2;

      cy.login();
      cy.getColonyTokenAddress(existingColony);

      cy.createColony(Cypress.config().colony2, false);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        existingToken,
      );

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`);
    });
  }
});
