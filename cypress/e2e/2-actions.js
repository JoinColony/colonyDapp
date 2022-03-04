import { bigNumberify } from 'ethers/utils';

describe('Colony can mint tokens via aciton', () => {
  it('mint native tokens', () => {
    const amountToMint = 10;
    const annotationText = 'Test annotation';

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('colonyTotalFunds', { timeout: 60000 })
      .invoke('text')
      .as('totalFunds');

    cy.contains(/new action/i, { timeout: 60000 }).click();
    // needs to include 2 expressions, otherwise it will try opeining the link from the home page
    cy.contains(/manage funds/i && /the tools/i).click();
    cy.findByText(/mint tokens/i).click();

    cy.get('input')
      .click()
      .type(amountToMint)
      .get('textarea')
      .click()
      .type(annotationText);

    cy.contains(/confirm/i).click();
    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
      { timeout: 20000 },
    );

    cy.getBySel('actionHeading').should(
      'have.text',
      `Mint ${amountToMint} ${Cypress.config().colony.nativeToken}`,
    );
    cy.getBySel('comment').should('have.text', annotationText);

    cy.getBySel('backButton').click();

    cy.get('@totalFunds').then(($totalFunds) => {
      const totalFunds = bigNumberify($totalFunds.split(',').join(''))
        .add(amountToMint)
        .toString();

      cy.getBySel('colonyTotalFunds', { timeout: 15000 }).then(($text) => {
        const text = $text.text().split(',').join('');
        expect(text).to.eq(totalFunds);
      });
    });
  });
});
