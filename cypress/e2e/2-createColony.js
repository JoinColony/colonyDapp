describe('Create a new colony', () => {
  if (!Cypress.config().skipInitTests) {
    it('creates a new colony with new token', () => {
      const { colony, baseUrl } = Cypress.config();
      const { name, nativeToken } = colony;

      cy.login();

      cy.createColony(colony, true);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        nativeToken,
      );

      cy.url().should('eq', `${baseUrl}/colony/${name}`);
    });

    it('New user is created which joins the colony', () => {
      const {
        colony: { name },
      } = Cypress.config();
      /*
        this will be the second address in the list;
        can be changed to further order in the list if the test needs to be repeated
      */
      cy.claimNewUserName(1);

      cy.url().should('be.equal', 'http://localhost:9090/landing');

      cy.visit(`/colony/${name}`);

      cy.getBySel('joinColonyButton', { timeout: 100000 }).click();

      cy.getBySel('joinColonyButton').should('not.exist');
    });

    it('creates a new colony with existing token', () => {
      const {
        baseUrl,
        colony: { nativeToken: existingToken, name: existingColony },
      } = Cypress.config();

      const colony = { name: 'maya' };

      cy.login();
      cy.getColonyTokenAddress(existingColony);

      cy.createColony(colony, false);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        existingToken,
      );

      cy.url().should('eq', `${baseUrl}/colony/${colony.name}`);
    });
  }
});
