import { Extension } from '@colony/colony-js';

import ganacheAccounts from '~lib/colonyNetwork/ganache-accounts.json';
import { createAddress } from '~utils/web3';

import createdColony from '../fixtures/colony.json';

describe('User can create motions via UAC', () => {
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

  it('Can mint native tokens - motion', () => {
    const amountToMint = 10;
    cy.mintTokens(amountToMint, true);

    cy.checkMotion();
  });

  it('Can make payment - motion', () => {
    const amountToPay = 10;
    const accounts = Object.entries(ganacheAccounts.private_keys).map(
      ([address]) => address,
    );

    cy.makePayment(amountToPay, createAddress(accounts[1]), true);
    cy.checkMotion();
  });

  it('Can create teams - motion', () => {
    const domainName = 'Cats';
    const domainPurpose = 'Only cats allowed';

    cy.createTeam(domainName, domainPurpose, true);

    cy.checkMotion();
  });

  it('Can edit teams - motion', () => {
    const domainName = 'Dolphins';
    const domainPurpose = 'This team has been taken over by dolphins';

    cy.editTeam(domainName, domainPurpose, true);

    cy.checkMotion();
  });

  it('Can transfer funds - motion', () => {
    const amountToTransfer = 2;

    cy.transferFunds(amountToTransfer, true);

    cy.checkMotion();
  });

  it('Can award users - motion', () => {
    const amountToAward = 10;

    cy.awardRep(amountToAward, true);

    cy.checkMotion();
  });

  it('Can smite users - motion', () => {
    const amountToSmite = 10;

    cy.smiteUser(amountToSmite, true);

    cy.checkMotion();
  });

  it('Can edit colony details', () => {
    const newName = 'solntse';

    cy.editColonyDetails(newName, true);

    cy.checkMotion();
  });

  it('Can update tokens', () => {
    const { name: existingColonyName } = Cypress.config().colony;
    cy.login();

    cy.updateTokens(existingColonyName, createdColony.name, true);

    cy.checkMotion();
  });
  it.only('Can unlock the native token', () => {
    const { colony } = Cypress.config();
    cy.login();

    cy.visit(`/colony/${colony.name}`);

    cy.unlockToken(colony);

    cy.getBySel('backButton').click();

    cy.getBySel('lockIconTooltip', { timeout: 15000 }).should('not.exist');
  });
});
