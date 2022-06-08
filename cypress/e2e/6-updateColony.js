import newColony from '../fixtures/colony.json';

describe('Colony can be updated', () => {
  const {
    baseUrl,
    skipInitTests,
    colony: { name: colonyName, nativeToken },
  } = Cypress.config();

  it('can update colony details', () => {
    const newName = 'plushka';

    cy.editColonyDetails(newName, false);
    cy.getBySel('backButton').click();

    cy.checkColonyName(newName);
  });

  // Will run only once as we create a new colony
  if (!skipInitTests) {
    it('can update colony tokens', () => {
      cy.login();
      cy.createColony(newColony, true);
      cy.url().should('eq', `${baseUrl}/colony/${newColony.name}`, {
        timeout: 90000,
      });

      cy.updateTokens(newColony.name, colonyName, false);

      cy.getBySel('backButton').click();

      cy.getBySel('availableFunds', { timeout: 60000 }).then(
        (availableFunds) => {
          expect(availableFunds.text()).to.contains(nativeToken);
        },
      );
    });
  }
});
