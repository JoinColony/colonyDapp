import { Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

describe('Claiming Stakes', () => {
  it(`User can claim their staked tokens`, () => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);

    // Install & enable voting reputation extension
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });

    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();
    cy.installExtension();
    cy.enableExtension(Extension.VotingReputation);

    // Create a motion to stake on
    const amountToMint = 10;
    cy.mintTokens(amountToMint, true);
    cy.checkMotion();

    // Activate tokens
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();
    cy.getBySel('inputMaxButton').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('tokenActivationConfirm').click().wait(10000);

    // Get amount of initial staked tokens
    cy.getBySel('stakedTokens', { timeout: 60000 })
      .invoke('text')
      .as('initialStakedTokens');

    // Close the token activation popover
    cy.getBySel('actionHeading').click();

    // Stake the motion
    cy.stakeMax('stakeWidgetStakeButton');

    // Close the gas station
    cy.getBySel('actionHeading').click();

    // Check that the staked tokens have increased
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();
    cy.get('@initialStakedTokens').then(($initialStakedTokens) => {
      const initialStakedTokens = bigNumberify(
        $initialStakedTokens.split(' ')[0],
      ).toString();

      cy.getBySel('stakedTokens', { timeout: 60000 }).then(($stakedTokens) => {
        const stakedTokens = $stakedTokens.text().split(' ')[0];
        expect(stakedTokens).to.should('be.gte', initialStakedTokens);
      });
    });

    // Close the token activation popover
    cy.getBySel('actionHeading').click();

    // Finalize the motion
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('finalizeButton').click().wait(5000);

    // Claim the stake
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('claimForColonyButton', { timeout: 100000 }).click().wait(5000);

    // Get amount of staked tokens
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();
    cy.getBySel('stakedTokens', { timeout: 60000 })
      .invoke('text')
      .as('newStakedTokens');

    // Check that the active tokens are correct
    cy.get('@initialStakedTokens').then(($initialStakedTokens) => {
      const initialStakedTokens = bigNumberify(
        $initialStakedTokens.split(' ')[0],
      ).toString();

      cy.getBySel('stakedTokens', { timeout: 60000 }).then(($stakedTokens) => {
        const stakedTokens = $stakedTokens.text().split(' ')[0];
        expect(stakedTokens).to.eq(initialStakedTokens);
      });
    });
  });
});
