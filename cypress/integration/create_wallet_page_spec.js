describe('The create wallet page', function() {
  it('contains a mnemonic phrase', function() {
    cy.visit('/create-wallet')
    cy.get('[data-test="mnemonicPhrase"]').invoke('text').then(text => {
    const phraseArray = text.split(' ')
      expect(phraseArray.length).to.eq(12)
      cy.get('[data-test="confirmStoredPhraseButton"]').click()
      cy.get('[data-test="confirmCreatedPhraseBackupButton"]').click()
      cy.get("#proofWord1").type(phraseArray[0])
      cy.get("#proofWord2").type(phraseArray[4])
      cy.get("#proofWord3").type(phraseArray[11])
      cy.get('[data-test="proveBackupPhraseButton"]').click()
    })
  })
})
