import { Extension } from '@colony/colony-js';
import numbro from 'numbro';
import Decimal from 'decimal.js';

import ganacheAccounts from '~lib/colonyNetwork/ganache-accounts.json';
import { createAddress } from '~utils/web3';

import createdColony from '../fixtures/colony.json';
import { numbroCustomLanguage } from '../../src/utils/numbers/numbroCustomLanguage';

describe('User can create motions via UAC', () => {
  const {
    colony: { name: colonyName },
  } = Cypress.config();
  numbro.registerLanguage(numbroCustomLanguage);
  numbro.setLanguage('en-GB');

  it('Installs & enables voting extensions', () => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);

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

    cy.makePayment(amountToPay, createAddress(accounts[15]), true);
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
    cy.managePermissions(true);

    cy.checkMotion();
  });

  it('User can activate tokens', () => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);
    // Activate tokens
    cy.activateTokens();
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

    cy.getBySel('yesVoteButton', { timeout: 30000 }).click({ force: true });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('voteButton').click().wait(7000);

    // to close the gas station
    cy.getBySel('actionHeading').click();

    cy.getBySel('revealButton', { timeout: 120000 }).click();
    cy.getBySel('motionStatusTag', { timeout: 30000 }).should(
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

    cy.reload();

    cy.get('@totalFunds').then(($totalFunds) => {
      const totalFunds = new Decimal($totalFunds.split(',').join(''))
        .add(amountToMint)
        .toDecimalPlaces(3)
        .toString();

      cy.getBySel('colonyTotalFunds', { timeout: 150000 }).then(($text) => {
        const text = $text.text().split(',').join('');
        expect(text).to.eq(totalFunds);
      });
    });
  });

  it.only('User can claim their stake', () => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);

    // Get amount of staked tokens
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();

    // Get amount of staked tokens
    cy.getBySel('stakedTokens', { timeout: 60000 })
      .invoke('text')
      .as('initialStakedTokens');

    cy.getBySel('stakesTab').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimableMotionsList', { timeout: 120000 })
      .wait(2000) // Wait is required to ensure hash is included
      .find(`[data-test="goToMotion"]`)
      .first()
      .click();

    // Get expected stake
    cy.get('@initialStakedTokens').then(($initialStakedTokens) => {
      const [initialStakedElement] = $initialStakedTokens.split(' ');
      const parsedStakedTokens = numbro.unformat(initialStakedElement);
      const initialStakedTokens = new Decimal(parsedStakedTokens).toFixed(0);

      // Get the staked value being claimed
      // We need a small wait to more reliably get the stakeBeingClaimed
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.getBySel('stakedValue', { timeout: 60000 })
        .wait(2000)
        .invoke('text')
        .then(($stakedValue) => {
          const [stakeBeingClaimedElement] = $stakedValue.split(' ');
          const parsedStakedValue = numbro.unformat(stakeBeingClaimedElement);
          const stakeBeingClaimed = new Decimal(parsedStakedValue).toFixed(0);

          cy.log('initialStakedTokens', initialStakedTokens);
          cy.log('stakeBeingClaimed', stakeBeingClaimed);
          const expectedStaked = new Decimal(initialStakedTokens)
            .sub(stakeBeingClaimed)
            .toFixed(0);
          cy.log('expectedStaked', expectedStaked);
          cy.wrap(expectedStaked);
        })
        .as('expectedStaked');
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimStakeButton', { timeout: 20000 }).click().wait(15000);

    // to close the gas station
    cy.getBySel('actionHeading').click();

    // Check that the active tokens are correct
    cy.getBySel('tokenActivationButton', { timeout: 12000 }).click();

    // Get expected stake and compare to current staked tokens after claiming
    cy.get('@expectedStaked').then(($expectedStaked) => {
      cy.log('$expectedStaked', $expectedStaked);
      cy.getBySel('stakedTokens', { timeout: 6000 })
        .invoke('text')
        .then(($newStakedTokens) => {
          const [newStakedTokensElement] = $newStakedTokens.split(' ');
          const parsedNewStaked = numbro.unformat(newStakedTokensElement);
          const newStaked = new Decimal(parsedNewStaked).toFixed(0);

          expect(newStaked).to.eq($expectedStaked);
        });
    });
  });

  it('Disables & deprecates voting extensions', () => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);

    // deprecate & unistall voting reputaiton extension
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });
    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();

    cy.uninstallExtension();
  });
});
