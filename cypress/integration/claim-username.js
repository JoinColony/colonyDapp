describe('Claims a username', () => {
  // in cypress tests

  it('Use a TrufflePig wallet', () => {
    cy.get('button')
      .contains('TrufflePig')
      .click();
  });

  it('Select the second account and Log in', () => {
    /*
     * Click on the Button disquised as a Select
     */
    cy.get('button[data-test="trufflepigAccountSelector"]', {
      timeout: 1000,
    }).click();
    /*
     * Select the second entry (Account 1), focus it, and click it
     */
    cy.get('li#accountIndex-listbox-entry-0')
      .trigger('mouseover')
      .click();
    /*
     * Click on the button to go to the dApp
     */
    cy.get('button[data-test="confirmTruffleAccount"]', { timeout: 2000 })
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
    cy.get('a[data-test="pickUserCreation"').click();
  });

  it('Go through the flow and claim a (ENS) username', () => {
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
      .contains('Continue')
      .click();
    /*
     * Wait a spell, it seems that the spinner on the button prevents
     * cypress to fetch the Gas Station hook.
     * This way, we make sure the modal is closed by the time it tries to.
     */
  });

  it('Sign the transaction', () => {
    /*
     * Check if the gas station is open
     */
    cy.get('div[data-test="gasStation"]', { timeout: 2000 }).should(
      'be.visible',
    );
    /*
     * Click on the Claim Username Transaction
     */
    cy.get('ul[data-test="gasStationGroupedTransaction"]')
      .get('li')
      .contains('Claim Username')
      .click();
    /*
     * Confirm the transaction
     */
    cy.get('button[data-test="gasStationConfirmTransaction"]', {
      timeout: 2000,
    })
      /*
       * Wait a bit, to make sure the gas limit has been estimated
       * We really need to teach cypress to wait for loading elements...
       */
      .click()
      .then(() => {
        /*
         * After the transaction succeeds we redirect to the dashboard
         */
        cy.get('div[data-test="dashboard"]').should('exist');
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
