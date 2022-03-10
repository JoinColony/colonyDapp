describe('Create a new colony', () => {
  if (!Cypress.config().skipInitTests) {
    it('creates a new colony', () => {
      const { name, nativeToken } = Cypress.config().colony;

      cy.login();

      cy.findByText(/create a colony/i).click();

      cy.get('input').first().click().type(name);
      cy.get('input').last().click().type(name);

      cy.findByText(/continue/i).click();

      cy.findByText(/create a new token/i).click();

      cy.get('input').first().click().type(nativeToken);
      cy.get('input').last().click().type(nativeToken);

      cy.findByText(/continue/i).click();
      cy.findByText(/continue/i).click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`, {
        timeout: 120000,
      });
      cy.getBySel('colonyTokenSymbol', { timeout: 60000 }).should(
        'have.text',
        nativeToken,
      );
    });
  }
});
