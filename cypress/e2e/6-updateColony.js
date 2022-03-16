describe('Colony can be updated', () => {
  it.only('can update colony details', () => {
    const annotationText = 'Test annotation';
    const newName = 'feola';

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.contains(/new action/i, { timeout: 60000 }).click();

    cy.contains(/advanced/i).click();
    cy.contains(/edit colony details/i).click();
    const filePath = 'cypress/fixtures/images/jaya-the-beast.png';
    cy.getBySel('avatarUpload').selectFile(filePath, { action: 'drag-drop' });

    cy.get('input').last().click().type(newName);
    cy.get('textarea').click().type(annotationText);
    cy.contains(/confirm/i).click();
  });

  it('can update colony tokens', () => {});
});
