const TEST_USER_NAME = 'cypressTestUser';

describe('Claims a username', () => {
  it('Connect to the dApp', () => {
    cy.visit('/connect');
  });

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
    cy.get('li#accountIndex-listbox-entry-1')
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
     * Fill the username form
     */
    cy.get('input[data-test="claimUsernameInput"]').type(TEST_USER_NAME);
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
      .wait(5000);
  });

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
      .click()
      .wait(10000)
      .then(() => {
        /*
         * Wait until the transaction succeeded
         */
        cy.get('span[data-test="gasStationTransactionSucceeded"]').should(
          'exist',
        );
      });
  });

  it('Go to the User Profile Settomgs', () => {
    /*
     * Click the Avatar Dropdown
     */
    cy.get('button[data-test="avatarDropdown"]').click();
    /*
     * Click on the Get Started link
     */
    cy.get('li[role="menuitem"]')
      .contains('Settings')
      .click();
  });

  it('Verify the Username', () => {
    /*
     * Click the Avatar Dropdown
     */
    cy.get('span[data-test="userProfileUsername"]').should(content => {
      /*
       * The user is listed in the "mention" format with an @ in front of it
       */
      expect(content.text().trim()).to.eq(`@${TEST_USER_NAME}`);
    });
  });
});
