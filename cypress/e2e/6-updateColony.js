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

    cy.updateTokens(existingColony);

    cy.getBySel('backButton').click();

    cy.getBySel('availableFunds', { timeout: 60000 }).then((availableFunds) => {
      expect(availableFunds.text()).to.contains(existingToken);
    });
  });
});
