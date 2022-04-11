import newColony from '../fixtures/colony.json';

describe('Colony can be updated', () => {
  it('can update colony details', () => {
    const newName = 'plushka';

    cy.editColonyDetails(newName, false);
    cy.getBySel('backButton').click();

    cy.checkColonyName(newName);
  });

  it('can update colony tokens', () => {
    const {
      name: existingColonyName,
      nativeToken: existingToken,
    } = Cypress.config().colony;

    cy.login();
    cy.createColony(newColony, true);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}/colony/${newColony.name}`,
      { timeout: 90000 },
    );

    cy.updateTokens(newColony.name, existingColonyName, false);

    cy.getBySel('backButton').click();

    cy.getBySel('availableFunds', { timeout: 60000 }).then((availableFunds) => {
      expect(availableFunds.text()).to.contains(existingToken);
    });
  });
});
