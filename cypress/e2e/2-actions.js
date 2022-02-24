describe(
  'Colony can mint tokens via aciton',
  { defaultCommandTimeout: 10000 },
  () => {
    it('mint native tokens', () => {
      const amountToMint = 10;
      const annotationText = 'Test annotation';

      cy.login();

      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.contains(/new action/i, { timeout: 60000 }).click();
      // needs to include 2 expressions, otherwise it will try opeining the link from the home page
      cy.contains(/manage funds/i && /the tools/i).click();
      cy.contains(/mint tokens/i)
        .click()
        .get('input')
        .click()
        .type(amountToMint)
        .get('textarea')
        .click()
        .type(annotationText);

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.contains(/confirm/i)
        .click()
        .wait(20000);
      cy.url().should('contains', `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`);

      cy.get('.DefaultAction_heading_2QNZ4BBa').should(
        'have.text',
        `Mint ${amountToMint} ${Cypress.config().colony.nativeToken}`,
      );
      cy.get('.Comment_text_3dflB-3T > span').should(
        'have.text',
        annotationText,
      );

      /*
        todo: go to the main page and check that the funds increased for the minted amount.
        Need to get the tokens amount before the start of the operation.
      */
    });
  },
);
