describe('The create wallet page', function() {
  it('contains a mnemonic phrase', function() {
    cy.visit('/create-wallet')
    cy.get('[data-test="mnemonicPhrase"]').invoke('text').then(text => expect(text.split(' ').length).to.eq(12))
  })
})
