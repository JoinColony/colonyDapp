import Decimal from 'decimal.js';
import { bigNumberify } from 'ethers/utils';
import ganacheAccounts from '~lib/colonyNetwork/ganache-accounts.json';

import { splitAddress } from '~utils/strings';
import { createAddress } from '~utils/web3';

describe('User can create actions via UAC', () => {
  it('Can mint native tokens', () => {
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
  it('Can make payment', () => {
    const amountToPay = 10;
    const annotationText = 'Test annotation';
    const accounts = Object.entries(ganacheAccounts.private_keys).map(
      ([address]) => address,
    );
    const cutAddress = splitAddress(createAddress(accounts[1]));
    const paidAmount = new Decimal(amountToPay).sub(
      new Decimal(1.0001).div(100).mul(amountToPay),
    );
    let prevColonyFunds;

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('colonyTotalFunds', { timeout: 30000 }).then(($text) => {
      const amount = $text.text().split(',').join('');
      prevColonyFunds = amount;
    });

    cy.getBySel('new-action-button', { timeout: 60000 }).click();
    cy.getBySel('index-modal-item').eq(0).click();
    cy.getBySel('index-modal-item').eq(0).click();

    cy.getBySel('payment-recipient-picker').click().type(accounts[1]);
    cy.getBySel('payment-recipient-item').first().click();

    cy.getBySel('payment-amount-input').click().type(amountToPay);

    cy.getBySel('payment-annotation').click().type(annotationText);
    cy.getBySel('payment-confirm-button').click();

    cy.getBySel('actionHeading', { timeout: 70000 }).should(
      'have.text',
      `Pay ${cutAddress.header}${cutAddress.start}...${
        cutAddress.end
      } ${paidAmount.toString()} ${Cypress.config().colony.nativeToken}`,
    );

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );

    cy.getBySel('comment').should('have.text', annotationText);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyTotalFunds', { timeout: 15000 }).then(($text) => {
      const amount = $text.text().split(',').join('');
      expect(amount).to.eq((prevColonyFunds - amountToPay).toString());
    });
  });
  it.only('Can create teams', () => {
    const annotationText = 'Test annotation';
    const domainName = 'Cats';
    const domainPurpose = 'Only cats allowed';

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('new-action-button', { timeout: 60000 }).click();
    cy.getBySel('index-modal-item').eq(2).click();
    cy.getBySel('index-modal-item').eq(0).click();

    cy.getBySel('domainNameInput').click().type(domainName);
    cy.getBySel('domainPurposeInput').click().type(domainPurpose);
    cy.getBySel('createDomainAnnotation').click().type(annotationText);

    cy.getBySel('createDomainConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 70000 }).should(
      'have.text',
      `New team: ${domainName}`,
    );

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );

    cy.getBySel('comment').should('have.text', annotationText);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('domainDropdownItemName')
      .last()
      .should('have.text', domainName);
    cy.getBySel('domainDropdownItemPurpose')
      .last()
      .should('have.text', domainPurpose);
  });
});
