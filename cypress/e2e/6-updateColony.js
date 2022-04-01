describe('Colony can be updated', () => {
  it.only('can update colony details', () => {
    const newName = 'plushka';

    cy.editColonyDetails(newName, false);
    cy.getBySel('backButton').click();

    cy.checkColonyName(newName);
  });

  it('can update colony tokens', () => {
    const {
      name: existingColony,
      nativeToken: existingToken,
    } = Cypress.config().colony;
    cy.getColonyTokenAddress(existingColony);

    const colony = { name: 'feola', nativeToken: 'FEOL' };

    cy.createColony(colony, true);

    cy.getBySel('manageFunds', { timeout: 60000 }).click();
    cy.getBySel('manageTokens', { timeout: 30000 }).click();

    cy.get('@existingTokenAddress').then((address) => {
      cy.get('input').last().click().type(address);
    });
    cy.getBySel('confirm').click();

    cy.getBySel('actionHeading', { timeout: 60000 }).should(
      'have.text',
      `Colony details changed`,
    );

    cy.checkUrlAfterAction(colony.name);

    cy.getBySel('backButton').click();

    cy.getBySel('availableFunds', { timeout: 60000 }).then((availableFunds) => {
      expect(availableFunds.text()).to.contains(existingToken);
    });
  });
});
