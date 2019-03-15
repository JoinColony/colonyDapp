describe('Unclaimed Profile Restrictions', () => {
  /*
   * So we can ensure the wallet is empty
   * And also test logging in this way
   */
  it('Use a software wallet (mnemonic phrase)', () => {
    cy.get('button')
      .contains('Mnemonic Phrase')
      .click();

    /*
     * Get mnemonic phrase from fixtures
     */
    cy.fixture('accounts').then(({ mnemonic }) => {
      /*
       * Fill the mnemonic Phrase Textarea
       */
      cy.get('#connectwalletmnemonic').type(mnemonic);
    });

    /*
     * Click on the button to go to the dApp
     */
    cy.get('button[data-test="submitMnemonic"]')
      /*
       * Here we also test the copy
       */
      .should('have.text', 'Go to Colony')
      .click();
  });

  it('Tries to leave a comment on the first task', () => {
    /*
     * Go to the first task in the dashboard list
     */
    cy.getFirstTask().click();

    cy.get('#comment')
      /*
       * Use force because it's disabled (as it should)
       */
      .click({ force: true })
      .then(() => {
        cy.get('p[data-test="claimProfileDialog"]').should('exist');
      });

    /*
     * Go back to the dashboard
     */
    cy.goToDashboard();
  });

  /*
   * This is skipped until the task is getting wired.
   * We can't actually rely on the _Request to Work_ button until then
   */
  it.skip('Tries to request to work on the first task', () => {
    /*
     * Go to the first task in the dashboard list
     */
    cy.getFirstTask().click();

    cy.get('button[data-test="requestWorkButton"]')
      .click()
      .then(() => {
        cy.get('p[data-test="claimProfileDialog"]').should('exist');
      });

    /*
     * Go back to the dashboard
     */
    cy.goToDashboard();
  });
});
