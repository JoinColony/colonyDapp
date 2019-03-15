describe('Claims a username', () => {
  it('Use a TrufflePig wallet', () => {
    cy.get('button')
      .contains('TrufflePig')
      .click();
  });

  it('Select the second account and Log in', () => {
    /*
     * Click on the Button disquised as a Select
     */
    cy.get('button[data-test="trufflepigAccountSelector"]').click();
    /*
     * Select the second entry (Account 1), focus it, and click it
     */
    cy.get('li#accountIndex-listbox-entry-0')
      .trigger('mouseover')
      .click();
    /*
     * Click on the button to go to the dApp
     */
    cy.get('button')
      .contains('Go to Colony')
      .click();
  });

  it('Open the Claim Username flow', () => {
    /*
     * Click the Avatar Dropdown
     */
    cy.get('button[data-test="avatarDropdown"]').click();
    /*
     * Click on the Get Started link
     */
    cy.get('button')
      .contains('Get started')
      .click();
  });

  it('Go through the flow and claim a (ENS) username', () => {
    /*
     * Click on the Continue button on the first modal of the Claim Username flow
     */
    cy.get('button')
      .contains('Continue')
      .click();
    /*
     * Load the usernames fixture
     */
    cy.fixture('users').then(({ ensName }) => {
      /*
       * Fill the username form
       */
      cy.get('input[data-test="claimUsernameInput"]').type(ensName);
    });
    /*
     * Submit your selected username
     */
    cy.get('button[data-test="claimUsernameConfirm"]')
      .click()
      /*
       * Wait a spell, it seems that the spinner on the button prevents
       * cypress to fetch the Gas Station hook.
       * This way, we make sure the modal is closed by the time it tries to.
       */
      .wait(2000);
  });

  /*
   * TODO fix these tests; they appear to not work on re-runs
   * because transactions are rehydrated from localStorage.
   * I haven't found a way to clear this reliably yet; maybe
   * we need a setup/teardown routine?
   */
  it('Sign the transaction', () => {
    /*
     * Check if the gas station is open
     */
    cy.get('div[data-test="gasStation"]').should('be.visible');
    /*
     * Click on the Claim Username Transaction
     */
    cy.get('ul[data-test="gasStationTransactionsList"]')
      .get('li')
      .contains('Confirm Your Username')
      .click();
    /*
     * Confirm the transaction
     */
    cy.get('button[data-test="gasStationConfirmTransaction"]')
      /*
       * Wait a bit, to make sure the gas limit has been estimated
       * We really need to teach cypress to wait for loading elements...
       */
      .wait(2000)
      .click()
      .then(() => {
        /*
         * Wait until the transaction succeeded
         */
        cy.get('span[data-test="gasStationTransactionSucceeded"]')
          .wait(10000)
          .should('exist');
      });
  });

  it('Go to the User Profile Settings', () => {
    cy.goToUserProfileSettings();
  });

  it('Verify the Username', () => {
    /*
     * Click the Avatar Dropdown
     */
    cy.fixture('users').then(({ ensName }) => {
      cy.get('span[data-test="userProfileUsername"]').should(content => {
        /*
         * The user is listed in the "mention" format with an @ in front of it
         */
        expect(content.text().trim()).to.eq(`@${ensName}`);
      });
    });
  });
});
