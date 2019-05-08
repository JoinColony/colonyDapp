describe('Goes to user wizard', () => {
  it('Use a TrufflePig wallet', () => {
    cy.logout();
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
    cy.get('button[data-test="userInputConfirm"]', { timeout: 5000 }).click();
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
    /*
     * Currently we have 8 transactions, until this is
     * simplified we still want to test
     */
    const verifyIndizes = Array.from({ length: 10 }, (v, i) => i + 1);

    verifyIndizes.forEach(val => {
      /*
       * Confirm the transactions
       */
      cy.confirmTx();

      /*
       * Verify that transactions have succeeded
       */
      cy.verifyTxByIndex(val);
    });
  });
});
