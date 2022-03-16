describe('Create a new colony', () => {
  if (!Cypress.config().skipInitTests) {
    it('creates a new colony', () => {
      const { name, nativeToken } = Cypress.config().colony;

      cy.login();

      cy.getBySel('createColony').click();

      cy.get('input').first().click().type(name);
      cy.get('input').last().click().type(name);

      cy.getBySel('claimColonyNameConfirm').click();
      cy.getBySel('createNewToken', { timeout: 20000 }).click();

      cy.get('input').first().click().type(nativeToken);
      cy.get('input').last().click().type(nativeToken);
      cy.getBySel('definedTokenConfirm').click();
      cy.getBySel('userInputConfirm').click();

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        nativeToken,
      );

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`);
    });
  }
});
