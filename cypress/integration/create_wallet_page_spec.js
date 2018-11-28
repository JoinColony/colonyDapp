describe('The create wallet page', function() {
  before(function(){
    cy.visit('/create-wallet')
    cy.get('[data-test="mnemonicPhrase"]').invoke('text').then(text => {
      const phraseArray = text.split(' ')
      beforeEach(function() {
        cy.wrap(phraseArray).as('phraseArray')
      })
    })
  })
  it('contains a mnemonic phrase', function() {
    expect(this.phraseArray.length).to.eq(12)
  })
   it('contains a button to confirm you stored the phrase', function() {
     cy.get('[data-test="confirmStoredPhraseButton"]').click()
   })
  it('then contains a button to confirm you backed up the phrase', function() {
     cy.get('[data-test="confirmCreatedPhraseBackupButton"]').click()
   })
  it('then asks you to prove the phrase', function() {
    cy.get("#proofWord1").type(this.phraseArray[0])
    cy.get("#proofWord2").type(this.phraseArray[4])
    cy.get("#proofWord3").type(this.phraseArray[11])
    cy.get('[data-test="proveBackupPhraseButton"]').click()
  })
})
