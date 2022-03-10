describe('Comments in action page', () => {
    const commentText = 'Can I comment in this action?';

    beforeEach(() => {
      cy.login();
      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.getBySel('action-item', { timeout: 60000 }).first().click();
      cy.getBySel('comment-input', { timeout: 40000 }).click().type(`${commentText}{enter}`).wait(5000);
    });

    it('User can comment on action page', () => {
      cy.getBySel('comment').last().should(
        'have.text',
        commentText,
      );
    });

    it('User with permissions can ban and unban users', () => {
      cy.getBySel('comment-actions-button').last().click();
      cy.getBySel('moderate-user-button').click();
      cy.getBySel('moderate-user-confirm-button').click().wait(5000);
      cy.getBySel('comment').last().should('have.css', 'color').and('eq', 'rgba(118, 116, 139, 0.8)');

      cy.getBySel('comment-actions-button').last().click();
      cy.getBySel('moderate-user-button').click();
      cy.getBySel('moderate-user-confirm-button').click().wait(5000);
      cy.getBySel('comment').last().should('have.css', 'color').and('eq', 'rgb(118, 116, 139)');
    });

    it('User with permissions can delete and restore comments', () => {
      cy.getBySel('comment-actions-button').last().click();
      cy.getBySel('moderate-comment-button').click();
      cy.getBySel('moderate-comment-confirm-button').click().wait(5000);
      cy.getBySel('comment').last().should('have.css', 'color').and('eq', 'rgba(118, 116, 139, 0.8)');

      cy.getBySel('comment-actions-button').last().click();
      cy.getBySel('moderate-comment-button').click();
      cy.getBySel('moderate-comment-confirm-button').click().wait(5000);
      cy.getBySel('comment').last().should('have.css', 'color').and('eq', 'rgb(118, 116, 139)');
    });

  },
);
