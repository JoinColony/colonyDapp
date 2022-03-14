describe('Comments in action page', () => {
  const commentText = 'Can I comment in this action?';

  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
    cy.getBySel('actionItem', { timeout: 60000 }).first().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('commentInput', { timeout: 40000 })
      .click()
      .type(`${commentText}{enter}`)
      .wait(5000);
  });

  it('User can comment on action page', () => {
    cy.getBySel('comment').last().should('have.text', commentText);
  });

  it('User with permissions can ban and unban users', () => {
    cy.getBySel('commentActionsButton').last().click();
    cy.getBySel('moderateUserButton').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('moderateUserConfirmButton').click().wait(5000);
    cy.getBySel('comment')
      .last()
      .should('have.css', 'color')
      .and('eq', 'rgba(118, 116, 139, 0.8)');

    cy.getBySel('commentActionsButton').last().click();
    cy.getBySel('moderateUserButton').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('moderateUserConfirmButton').click().wait(5000);
    cy.getBySel('comment')
      .last()
      .should('have.css', 'color')
      .and('eq', 'rgb(118, 116, 139)');
  });

  it('User with permissions can delete and restore comments', () => {
    cy.getBySel('commentActionsButton').last().click();
    cy.getBySel('moderateCommentButton').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('moderateCommentConfirmButton').click().wait(5000);
    cy.getBySel('comment')
      .last()
      .should('have.css', 'color')
      .and('eq', 'rgba(118, 116, 139, 0.8)');

    cy.getBySel('commentActionsButton').last().click();
    cy.getBySel('moderateCommentButton').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('moderateCommentConfirmButton').click().wait(5000);
    cy.getBySel('comment')
      .last()
      .should('have.css', 'color')
      .and('eq', 'rgb(118, 116, 139)');
  });
});
