import { bigNumberify } from 'ethers/utils';

import ganacheAccounts from '~lib/colonyNetwork/ganache-accounts.json';
import { createAddress } from '~utils/web3';

describe('User can create actions via UAC', () => {
  it('Can mint native tokens', () => {
    const amountToMint = 10000;
    cy.mintTokens(amountToMint, false);

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
    const accounts = Object.entries(ganacheAccounts.private_keys).map(
      ([address]) => address,
    );

    cy.makePayment(amountToPay, createAddress(accounts[1]), false);

    cy.getBySel('backButton').click();

    cy.get('@totalFunds').then(($totalFunds) => {
      const totalFunds = bigNumberify($totalFunds.split(',').join(''))
        .sub(amountToPay)
        .toString();

      cy.getBySel('colonyTotalFunds', { timeout: 15000 }).then(($text) => {
        const text = $text.text().split(',').join('');
        expect(text).to.eq(totalFunds);
      });
    });
  });

  it('Can create teams', () => {
    const domainName = 'Cats';
    const domainPurpose = 'Only cats allowed';

    cy.createTeam(domainName, domainPurpose, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('domainDropdownItemName')
      .last()
      .should('have.text', domainName);
    cy.getBySel('domainDropdownItemPurpose')
      .last()
      .should('have.text', domainPurpose);
  });

  it('Can edit teams', () => {
    const domainName = 'Dolphins';
    const domainPurpose = 'This team has been taken over by dolphins';

    cy.editTeam(domainName, domainPurpose, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('domainDropdownItemName')
      .last()
      .should('have.text', domainName);
    cy.getBySel('domainDropdownItemPurpose')
      .last()
      .should('have.text', domainPurpose);
  });

  it('Can transfer funds', () => {
    const amountToTransfer = 1000;

    cy.transferFunds(amountToTransfer, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('colonyDomainSelectorItem').last().click();

    cy.get('@teamFunds').then(($teamFunds) => {
      const teamFunds = bigNumberify($teamFunds.split(',').join(''))
        .add(amountToTransfer)
        .toString();

      cy.getBySel('colonyFundingNativeTokenValue', { timeout: 15000 }).then(
        ($text) => {
          const text = $text.text().split(',').join('');
          expect(text).to.eq(teamFunds);
        },
      );
    });
  });
  it('Can unlock the native token', () => {
    const colony = { name: 'sirius', nativeToken: 'SIRS' };
    cy.login();
    cy.createColony(colony, true);
    cy.url().should('eq', `${Cypress.config().baseUrl}/colony/${colony.name}`, {
      timeout: 90000,
    });

    cy.unlockToken(colony);

    cy.getBySel('backButton').click();

    cy.getBySel('lockIconTooltip', { timeout: 15000 }).should('not.exist');
  });
  it('Can manage permissions', () => {
    const { colony } = Cypress.config();
    cy.managePermissions(colony.name);
  });

  it('Can award users', () => {
    const amountToAward = 100;
    cy.awardRep(amountToAward, false);
  });

  it('Can smite users', () => {
    const amountToSmite = 10;

    cy.smiteUser(amountToSmite, false);
  });

  it('Make payment from a subdomain', () => {
    const amountToPay = 10;
    const accounts = Object.entries(ganacheAccounts.private_keys).map(
      ([address]) => address,
    );

    cy.makePayment(amountToPay, createAddress(accounts[1]), false, true);
  });

  it('Can enable recovery mode', () => {
    const storageSlot = '0x05';
    const storageSlotValue =
      '0x0000000000000000000000000000000000000000000000000000000000000002';
    const annotationText = 'We have to recover what we have lost';

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('newActionButton', { timeout: 70000 }).click();
    cy.getBySel('advancedDialogIndexItem').click();
    cy.getBySel('recoveryDialogIndexItem').click();

    cy.getBySel('recoveryAnnotation').click().type(annotationText);

    cy.getBySel('recoveryConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 100000 }).contains(
      'Recovery mode activated by',
    );

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );

    cy.getBySel('comment').should('have.text', annotationText);

    cy.getBySel('storageSlotInput').click().type(storageSlot);
    cy.getBySel('storageSlotValueInput').click().type(storageSlotValue);
    cy.getBySel('storageSlotSubmitButton').click();

    cy.getBySel('newSlotValueEvent', { timeout: 40000 }).should(
      'have.text',
      storageSlotValue,
    );

    cy.getBySel('approveExitButton').click();

    cy.getBySel('closeGasStationButton').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('reactivateColonyButton', { timeout: 40000 })
      .click()
      .wait(20000)
      .should('not.exist');
  });
});
