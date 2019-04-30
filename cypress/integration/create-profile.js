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
    cy.get('button[data-test="claimColonyNameConfirm"]')
      .click()
      /*
       * Wait until next wizard step opens
       */
      .wait(2000);
  });

  it('Fill out token details in fourth wizard step', () => {
    cy.get('div[data-test="hubOptions"] button')
      .first()
      .click();
    /*
     * Load the token details from fixture
     */
    cy.fixture('colonies').then(({ tokenName, tokenSymbol }) => {
      /*
       * Fill the colonyName form
       */
      cy.get('input[data-test="defineTokenName"]').type(tokenName);
      cy.get('input[data-test="defineTokenSymbol"]').type(tokenSymbol);
    });
    /*
     * Submit your selected colonyName
     */
    cy.get('button[data-test="definedTokenConfirm"]').click();
  });
});
