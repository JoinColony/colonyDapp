describe('Creates a new profile', () => {
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

  it('Open the create colony wizard', () => {
    /*
     * Click the Avatar Dropdown once avatarDropdown is available
     */
    cy.get('button[data-test="avatarDropdown"]').then(btn => btn.click());

    /*
     * Click on the Create Colony link
     */

    cy.get('a')
      .contains('Create a Colony')
      .click();
  });
  /*
   * Please keep in mind that the test will not work on rerun
   * since the username step will be skipped
   */
  it('Fill out (ENS) username in first wizard step', () => {
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
       * Wait until next wizard step opens
       */
      .wait(2000);
  });

  it('Fill out (ENS) colonyName in second wizard step', () => {
    /*
     * Load the colonyNames fixture
     */
    cy.fixture('colonies').then(({ colonyName, displayName }) => {
      /*
       * Fill the colonyName form
       */
      cy.get('input[data-test="claimColonyNameInput"]').type(colonyName);
      cy.get('input[data-test="claimColonyDisplayNameInput"]').type(
        displayName,
      );
    });
    /*
     * Submit your selected colonyName
     */
    cy.get('button[data-test="claimColonyNameConfirm"]').click();
  });

  it('Fill out token details in fourth wizard step', () => {
    cy.get('div[data-test="hubOptions"] button', { timeout: 2000 })
      .first()
      .click();
    /*
     * Load the token details from fixture
     */
    cy.fixture('colonies').then(({ tokenName, tokenSymbol }) => {
      /*
       * Fill the tokenName and tokenSymbol form
       */
      cy.get('input[data-test="defineTokenName"]').type(tokenName);
      cy.get('input[data-test="defineTokenSymbol"]').type(tokenSymbol);
    });
    /*
     * Submit your token details
     */
    cy.get('button[data-test="definedTokenConfirm"]').click();
  });

  it('Confirm user input and process transactions', () => {
    cy.get('button[data-test="userInputConfirm"]').click();
  });

  it('Sign the transaction', () => {
    /*
     * Check if the gas station is open
     */
    cy.get('div[data-test="gasStation"]', { timeout: 6000 }).should(
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
    cy.confirmTx();
    /*
     * Deal with next transaction
     * Click on the Claim Username Transaction
     */
    cy.get('ul[data-test="gasStationGroupedTransaction"]')
      .get('li')
      .contains('Create Token')
      .click();
    /*
     * Confirm the transaction
     */
    cy.confirmTx();

    cy.get('ul[data-test="gasStationGroupedTransaction"]')
      .get('li')
      .contains('Create Colony')
      .click();

    cy.confirmTx();

    cy.get('ul[data-test="gasStationGroupedTransaction"]')
      .get('li')
      .contains('Create Colony Name')
      .click();

    cy.confirmTx();

    cy.get('div[data-test="dashboard"]').should('exist');
  });
});
