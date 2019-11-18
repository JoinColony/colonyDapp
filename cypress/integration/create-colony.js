describe('Creates a Colony', () => {
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
     * Select the fourth entry (Account 3), focus it, and click it
     */
    cy.get('li#accountIndex-listbox-entry-3')
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
     * Fill the username form
     */
    cy.get('[data-test=claimUsernameInput]').type('cypresscreatecolonyuser');
    /*
     * Submit your selected username
     */

    cy.get('[data-test="claimUsernameConfirm"]', {
      timeout: 60000,
    })
      .contains('Continue')
      .click();

    cy.confirmTx();
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

  it('Fill out (ENS) colonyName in second wizard step', () => {
    /*
     * Load the colonyNames fixture
     */
    cy.fixture('colonies').then(({ colonyName, displayName }) => {
      /*
       * Fill the colonyName form
       */
      cy.get('input[data-test="claimColonyDisplayNameInput"]').type(
        displayName,
      );

      cy.get('input[data-test="claimColonyNameInput"]').type(colonyName);
    });

    /*
     * Submit your selected colonyName
     */
    cy.get('button[data-test="claimColonyNameConfirm"]', {
      timeout: 6000,
    }).click();
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

  it('Sign the transactions', () => {
    cy.get('ul[data-test="gasStationGroupedTransaction"] > li').each(() => {
      /*
       * Confirm the transactions
       */
      cy.confirmTx();
    });
  });

  it('Verifies the colony was created', () => {
    cy.fixture('colonies').then(({ colonyName }) => {
      /*
       * The app redirects to the colony dashboard
       */
      cy.location('pathname', { timeout: 60000 }).should(
        'eq',
        `/colony/${colonyName}`,
      );
    });
  });
});
