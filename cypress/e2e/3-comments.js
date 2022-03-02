describe(
  'Comments in action page',
  { defaultCommandTimeout: 10000 },
  () => {
    const commentText = 'Can I comment in this action?';

    beforeEach(() => {
      cy.login();
      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.get('[data-cy=action-item]', { timeout: 60000 }).first().click().wait(40000);
      cy.get('[data-cy=comment-input]').click().type(`${commentText}{enter}`).wait(5000);
    });

    it('User can comment on action page', () => {
      cy.get('[data-cy=comment]').last().should(
        'have.text',
        commentText,
      );
    });

    it('User with permissions can ban and unban users', () => {
      cy.get('[data-cy=comment-actions-button]').last().click();
      cy.get('[data-cy=moderate-user-button]').click().wait(2000);
      cy.get('[data-cy=moderate-user-confirm-button]').click().wait(5000);
      cy.get('[data-cy=comment]').last().should('have.css', 'color').and('eq', 'rgba(118, 116, 139, 0.8)');

      cy.get('[data-cy=comment-actions-button]').last().click();
      cy.get('[data-cy=moderate-user-button]').click().wait(2000);
      cy.get('[data-cy=moderate-user-confirm-button]').click().wait(5000);
      cy.get('[data-cy=comment]').last().should('have.css', 'color').and('eq', 'rgb(118, 116, 139)');
    });

    it('User with permissions can delete and restore comments', () => {
      cy.get('[data-cy=comment-actions-button]').last().click();
      cy.get('[data-cy=moderate-comment-button]').click().wait(2000);
      cy.get('[data-cy=moderate-comment-confirm-button]').click().wait(5000);
      cy.get('[data-cy=comment]').last().should('have.css', 'color').and('eq', 'rgba(118, 116, 139, 0.8)');

      cy.get('[data-cy=comment-actions-button]').last().click();
      cy.get('[data-cy=moderate-comment-button]').click().wait(2000);
      cy.get('[data-cy=moderate-comment-confirm-button]').click().wait(5000);
      cy.get('[data-cy=comment]').last().should('have.css', 'color').and('eq', 'rgb(118, 116, 139)');
    });

  },
);
