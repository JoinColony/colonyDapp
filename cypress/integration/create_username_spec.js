describe('Can create a username in dev mode', () => {
  it('The /connect page contains a TrufflePig button', () => {
    cy.visit('/connect');
    cy.contains('TrufflePig').click();
  });

  it('TrufflePig button shows a go to colony button which loads dashboard', () => {
    cy.contains('Go to Colony').click();
    cy.url({ timeout: 60000 }).should('include', '/dashboard');
  });

  it('The dashboard contains an avatar dropdown where you can enter a username', () => {
    cy.get('[data-test="avatarDropdown"]').click();
  });

  it('The avatar dropdown lets you get started and enter a username', () => {
    cy.contains('Get started').click();
    cy.get('[name="username"]').type('littlePiggie');
    cy.contains('Confirm').click();
  });
});
