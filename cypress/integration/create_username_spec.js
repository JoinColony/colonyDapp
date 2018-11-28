describe('Can create a username in dev mode', function() {
  it('The /connect page contains a TrufflePig button', function() {
    cy.visit('/connect')
    cy.contains('TrufflePig').click()
  })
  it('TrufflePig button shows a go to colony button which loads dashboard', function() {
    cy.contains('Go to Colony').click()
    cy.url().should('include', '/dashboard')
  })
  it('The dashboard contains an avatar dropdown where you can enter a username', function() {
    cy.get('[data-test="avatarDropdown"]').click()
  })
  it('The avatar dropdown lets you get started and enter a username', function() {
    cy.contains('Get started').click()
    cy.get('[name="username"]').type('littlePiggie')
    cy.contains('Confirm').click()
  })
})
