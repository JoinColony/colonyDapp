describe('Colony can be updated', () => {
  it.only('can update colony details', () => {
    const annotationText = 'Test annotation';
    const colonyName = Cypress.config().colony.name;
    const newName = 'plushka';

    cy.login();
    cy.visit(`/colony/${colonyName}`);
    cy.changeColonyname(colonyName, newName);

    const filePath = 'cypress/fixtures/images/jaya-the-beast.png';
    cy.getBySel('fileUpload').selectFile(filePath, { action: 'drag-drop' });

    cy.get('textarea').click().type(annotationText);
    cy.getBySel('confirmButton').click();

    cy.getBySel('actionHeading', { timeout: 60000 }).should(
      'have.text',
      `Colony details changed`,
    );
    cy.checkUrlAfterAction(colonyName);
    cy.getBySel('backButton').click();

    cy.checkColonyName(newName);

    // change the colony name back
    cy.changeColonyname(newName, colonyName);
    cy.getBySel('confirmButton').click();
    cy.checkUrlAfterAction(colonyName);

    cy.getBySel('backButton').click();

    cy.checkColonyName(colonyName);
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
