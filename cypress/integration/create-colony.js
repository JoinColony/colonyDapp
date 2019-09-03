describe('Goes to user wizard', () => {
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
      .contains('Continue')
      .click();

    /*
     * The app redirects to the 'claim username' flow
     */
    cy.location('pathname', { timeout: 60000 }).should('eq', '/create-user');
  });

  it('Go through the flow and claim a (ENS) username', () => {
    /*
     * Load the usernames fixture
     */
    cy.fixture('users').then(({ ensName }) => {
      /*
       * Fill the username form
       */
      cy.get('[data-test=claimUsernameInput]').type(ensName);
    });
    /*
     * Submit your selected username
     */

    cy.get('[data-test="claimUsernameConfirm"]', {
      timeout: 60000,
    })
      .contains('Continue')
      .click();

    cy.confirmTx();

    /*
     * Wait a spell, it seems that the spinner on the button prevents
     * cypress to fetch the Gas Station hook.
     * This way, we make sure the modal is closed by the time it tries to.
     */
  });

  it('Open the create colony wizard', () => {
    /*
     * Click the Avatar Dropdown once avatarDropdown is available
     */
    cy.get('[data-test="avatarDropdown"]', { timeout: 60000 }).then(btn =>
      btn.click(),
    );

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
});

describe('Creates a new profile', () => {
  it('Fill out (ENS) colonyName in second wizard step', () => {
    /*
     * Load the colonyNames fixture
     */
    cy.fixture('colonies').then(({ colonyName, displayName }) => {
      /*
       * Fill the colonyName form
       */
      cy.get('input[data-test="claimColonyNameInput"]', {
        timeout: 60000,
      }).type(colonyName);

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
    cy.get('div[data-test="hubOptions"] button', { timeout: 60000 })
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
    cy.get('button[data-test="userInputConfirm"]', { timeout: 60000 }).click();
  });

  it('Sign the transaction', () => {
    /*
     * Check if the gas station is open
     */
    cy.get('div[data-test="gasStation"]', { timeout: 60000 }).should(
      'be.visible',
    );

    /*
     * Currently we have 9 transactions, until this is
     * simplified we still want to test
     */

    cy.get('ul>li').each((val, index) => {
      /*
       * Confirm the transactions
       */
      cy.confirmTx();

      /*
       * Verify that transactions have succeeded
       */
      cy.verifyTxByIndex(index);
    });
  });
});
