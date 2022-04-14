import { bigNumberify } from 'ethers/utils';
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

  it('Can unlock the native token', () => {
    const { colony } = Cypress.config();
    cy.login();

    cy.visit(`/colony/${colony.name}`);

    cy.unlockToken(colony);

    cy.getBySel('backButton').click();

    cy.getBySel('lockIconTooltip', { timeout: 15000 }).should('not.exist');
  });

  it('Can manage permissions', () => {
    const { colony } = Cypress.config();

    cy.managePermissions(colony.name, true);

    cy.checkMotion();
  });

  it('User can activate tokens', () => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
    // Activate tokens
    cy.tokenActivation();
  });

  it('Can create, stake, vote, finalise motion & claim tokens', () => {
    const amountToMint = 10;
    cy.mintTokens(amountToMint);

    cy.checkMotion();

    cy.stakeMax('stakeWidgetStakeButton');

    cy.getBySel('stakeWidgetObjectButton').click();

    cy.stakeMax('objectDialogStakeButton');

    // to close the gas station
    cy.getBySel('actionHeading').click();

    cy.get('input[type="radio"]').first().click({ force: true });
    cy.getBySel('voteButton').click();

    cy.getBySel('revealButton').click();
    cy.getBySel('motionStatusTag', { timeout: 20000 }).should(
      'have.text',
      'Passed',
    );

    // to close the gas station
    cy.getBySel('actionHeading').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('finalizeButton').click().wait(5000);

    cy.getBySel('backButton').click();

    cy.getBySel('eventsNavigationButton').click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimForColonyButton', { timeout: 100000 }).click().wait(5000);

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

  it('Claiming Stakes', () => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);

    // Get amount of staked tokens
    cy.getBySel('tokenActivationButton', { timeout: 12000 }).click();

    // Get amount of staked tokens
    cy.getBySel('stakedTokens', { timeout: 60000 })
      .invoke('text')
      .as('initialStakedTokens');

    cy.getBySel('stakesTab').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimableMotionsList', { timeout: 20000 })
      .wait(2000) // Wait is required to ensure hash is included
      .find(`[data-test="goToMotion"]`)
      .first()
      .click();

    // Get the staked value being claimed
    cy.getBySel('stakedValue', { timeout: 60000 })
      .invoke('text')
      .as('stakedValue');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimStakeButton', { timeout: 20000 }).click().wait(10000);

    // to close the gas station
    cy.getBySel('actionHeading').click();

    // Check that the active tokens are correct
    cy.getBySel('tokenActivationButton', { timeout: 12000 }).click();

    // function is required for `this` object to work
    cy.getBySel('stakedTokens', { timeout: 6000 })
      .invoke('text')
      .as('nowStakedTokens')
      .then(function () {
        const initialStakedTokens = this.initialStakedTokens
          .split(' ')[0]
          .split(',')
          .join('')
          .split('.')[0];
        const stakedValue = bigNumberify(
          this.stakedValue.split(' ')[0].split(',').join('').split('.')[0],
        );
        const newStaked = this.nowStakedTokens
          .split(' ')[0]
          .split(',')
          .join('')
          .split('.')[0];
        const expectedStaked = bigNumberify(initialStakedTokens)
          .sub(stakedValue)
          .toString();
        expect(newStaked).to.eq(expectedStaked);
      });
  });

  it('Disables & deprecates voting extensions', () => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);

    // deprecate & unistall voting reputaiton extension
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });
    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();

    cy.uninstallExtension();
  });
});
