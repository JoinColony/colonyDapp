describe('Create a new colony', () => {
  const {
    colony,
    colony: { name: colonyName, nativeToken },
    baseUrl,
  } = Cypress.config();

  if (!Cypress.config().skipInitTests) {
    it('creates a new colony with new token', () => {
      cy.login();

      cy.createColony(colony, true);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        nativeToken,
      );

      cy.url().should('eq', `${baseUrl}/colony/${colonyName}`);
    });

    it('New user is created which joins the colony', () => {
      /*
        this will be the second address in the list;
        can be changed to further order in the list if the test needs to be repeated
      */
      cy.claimNewUserName(1);

      cy.url().should('be.equal', 'http://localhost:9090/landing');

      cy.visit(`/colony/${colonyName}`);

      cy.getBySel('joinColonyButton', { timeout: 100000 }).click();

      cy.getBySel('joinColonyButton').should('not.exist');
    });

    it('creates a new colony with existing token', () => {
      const newColony = { name: 'feola' };

      cy.login();
      cy.getColonyTokenAddress(colonyName);

      cy.createColony(newColony, false);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        nativeToken,
      );

      cy.url().should('eq', `${baseUrl}/colony/${newColony.name}`);
    });
  }
});
