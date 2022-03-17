describe('Create a new colony', () => {
  if (!Cypress.config().skipInitTests) {
    it('creates a new colony with new token', () => {
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

    it.only('creates a new colony with existing token', () => {
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

      cy.getBySel('createColony').click();

      cy.get('input').first().click().type(name);
      cy.get('input').last().click().type(name);

      cy.getBySel('claimColonyNameConfirm').click();
      cy.getBySel('useExistingToken', { timeout: 20000 }).click();

      cy.get('@existingTokenAddress').then((address) => {
        cy.get('input').click().type(address);
        cy.getBySel('definedTokenConfirm').click();
      });

      cy.getBySel('userInputConfirm').click();

      cy.getBySel('colonyTokenSymbol', { timeout: 120000 }).should(
        'have.text',
        existingToken,
      );

      cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${name}`);
    });
  }
});
