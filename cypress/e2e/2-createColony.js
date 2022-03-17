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

    it('creates a new colony with existing token', () => {
      const {
        nativeToken: existingToken,
        name: existingColony,
      } = Cypress.config().colony;
      const { name } = Cypress.config().colony2;

      cy.login();
      cy.visit(`/colony/${existingColony}`);
      cy.getBySel('colonyMenu', { timeout: 60000 }).click();
      cy.getBySel('nativeTokenAddress')
        .invoke('text')
        .as('existingTokenAddress');

      cy.createColony(Cypress.config().colony2, false);

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        existingToken,
      );

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`);
    });
  }
});
