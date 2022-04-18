import newColony from '../fixtures/colony.json';

const { baseUrl } = Cypress.config();

describe('Colony can be updated', () => {
  it('can update colony details', () => {
    const newName = 'plushka';

    cy.editColonyDetails(newName, false);
    cy.getBySel('backButton').click();

    cy.checkColonyName(newName);
  });

  // Will run only once as we create a new colony
  if (!Cypress.config().skipInitTests) {
    it('can update colony tokens', () => {
      const {
        name: existingColonyName,
        nativeToken: existingToken,
      } = Cypress.config().colony;

      cy.login();
      cy.createColony(newColony, true);
      cy.url().should('eq', `${baseUrl}/colony/${newColony.name}`, {
        timeout: 90000,
      });

      cy.updateTokens(newColony.name, existingColonyName, false);

      cy.getBySel('backButton').click();

      cy.getBySel('availableFunds', { timeout: 60000 }).then(
        (availableFunds) => {
          expect(availableFunds.text()).to.contains(existingToken);
        },
      );
    });
  }
});
