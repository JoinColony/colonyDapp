import { bigNumberify } from 'ethers/utils';

describe('Token Activation & Deactivation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
  });

  it(`User can activate tokens`, () => {
    // Open Token Activation popover
    const amountToActivate = 100;
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();

    // Get the number of active tokens
    cy.getBySel('activeTokens', { timeout: 60000 })
      .invoke('text')
      .as('activatedTokens');

    cy.getBySel('activateTokensInput').click().type(amountToActivate);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('tokenActivationConfirm').click().wait(10000);

    // Check that the active tokens are correct
    cy.get('@activatedTokens').then(($activatedTokens) => {
      const activatedTokens = bigNumberify($activatedTokens.split(' ')[0])
        .add(amountToActivate)
        .toString();

      cy.getBySel('activeTokens', { timeout: 60000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0];
        expect(tokens).to.eq(activatedTokens);
      });
    });
  });

  it(`User can deactivate tokens`, () => {
    // Open Token Activation popover
    const amountToDeactivate = 100;
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();

    // Get the number of inactive tokens
    cy.getBySel('inactiveTokens', { timeout: 60000 })
      .invoke('text')
      .as('deactivatedTokens');

    cy.getBySel('deactivateTokensToggle').click();

    cy.getBySel('activateTokensInput').click().type(amountToDeactivate);
    cy.getBySel('tokenActivationConfirm').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);

    // Check that the inactive tokens are correct
    cy.get('@deactivatedTokens').then(($deactivatedTokens) => {
      const deactivatedTokens = bigNumberify($deactivatedTokens.split(' ')[0])
        .sub(amountToDeactivate)
        .toString();

      cy.getBySel('inactiveTokens', { timeout: 60000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0];
        expect(tokens).to.eq(deactivatedTokens);
      });
    });
  });
});
