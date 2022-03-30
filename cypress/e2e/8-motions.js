import { Extension } from '@colony/colony-js';

import ganacheAccounts from '~lib/colonyNetwork/ganache-accounts.json';
import { createAddress } from '~utils/web3';

describe('User can create actions via UAC', () => {
  it('Installs & enables voting extensions', () => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);

    // install & enable voting reputaiton extension
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });

    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();
    cy.installExtension();
    cy.enableExtension(Extension.VotingReputation);
  });

  it('Can mint native tokens', () => {
    const amountToMint = 10;
    cy.mintTokens(amountToMint, true);

    cy.checkMotion();
  });

  it('Can make payment', () => {
    const amountToPay = 10;
    const accounts = Object.entries(ganacheAccounts.private_keys).map(
      ([address]) => address,
    );

    cy.makePayment(amountToPay, createAddress(accounts[1]), true);
    cy.checkMotion();
  });

  it('Can create teams', () => {
    const domainName = 'Cats';
    const domainPurpose = 'Only cats allowed';

    cy.createTeam(domainName, domainPurpose, true);

    cy.checkMotion();
  });

  it('Can edit teams', () => {
    const domainName = 'Dolphins';
    const domainPurpose = 'This team has been taken over by dolphins';

    cy.updateTeam(domainName, domainPurpose, true);

    cy.checkMotion();
  });

  it.only('Can transfer funds', () => {
    const amountToTransfer = 2;

    cy.transferFunds(amountToTransfer, true);

    cy.checkMotion();
  });

  it('Can award users', () => {
    const amountToAward = 10;
    const annotationText = 'You have been a good boy, time for your reward';
    let rewardedUser;

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('newActionButton', { timeout: 90000 }).click();
    cy.getBySel('indexModalItem').eq(3).click();
    cy.getBySel('indexModalItem').eq(0).click();

    cy.getBySel('reputationRecipientSelector').click({ force: true });
    cy.getBySel('reputationRecipientSelectorItem').last().click();
    cy.getBySel('reputationRecipientName').then(($value) => {
      rewardedUser = $value.text();
    });
    cy.getBySel('reputationAmountInput').click().type(amountToAward);

    cy.getBySel('reputationAnnotation').click().type(annotationText);

    cy.getBySel('reputationConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 100000 }).then(($value) => {
      expect($value.text()).to.eq(
        `Award ${rewardedUser} with a ${amountToAward} pts reputation reward`,
      );
    });

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );

    cy.getBySel('comment').should('have.text', annotationText);
  });
  it('Can smite users', () => {
    const amountToSmite = 10;
    const annotationText =
      'You have been a naughty boy, time for your punishment';
    let smoteUser;

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('newActionButton', { timeout: 90000 }).click();
    cy.getBySel('indexModalItem').eq(3).click();
    cy.getBySel('indexModalItem').eq(1).click();

    cy.getBySel('reputationRecipientSelector').click({ force: true });
    cy.getBySel('reputationRecipientSelectorItem').last().click();
    cy.getBySel('reputationRecipientName').then(($value) => {
      smoteUser = $value.text();
    });
    cy.getBySel('reputationAmountInput').click().type(amountToSmite);

    cy.getBySel('reputationAnnotation').click().type(annotationText);

    cy.getBySel('reputationConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 100000 }).then(($value) => {
      expect($value.text()).to.eq(
        `Smite ${smoteUser} with a ${amountToSmite} pts reputation penalty`,
      );
    });

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );

    cy.getBySel('comment').should('have.text', annotationText);
  });
});
