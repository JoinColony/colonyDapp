import { bigNumberify } from 'ethers/utils';

describe('Token Activation & Deactivation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
  });

  it(`User can activate tokens`, () => {
    // Open Token Activation popover
    const amountToActivate = 10;

    // Activate tokens
    cy.tokenActivation(amountToActivate);

    // Check that the active tokens are correct
    cy.get('@activatedTokens').then(($activatedTokens) => {
      const activatedTokens = bigNumberify(
        $activatedTokens.split(' ')[0].split(',').join(''),
      )
        .add(amountToActivate)
        .toString();

      cy.getBySel('activeTokens', { timeout: 60000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0].split(',').join('');
        expect(tokens).to.eq(activatedTokens);
      });
    });
  });

  it(`User can deactivate tokens`, () => {
    // Open Token Activation popover
    const amountToDeactivate = 10;
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();

    // Get the number of inactive tokens
    cy.getBySel('inactiveTokens', { timeout: 60000 })
      .invoke('text')
      .as('deactivatedTokens');

    cy.getBySel('deactivateTokensToggle').click();

    cy.getBySel('activateTokensInput').click().type(amountToDeactivate);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('tokenActivationConfirm').click().wait(100000);

    // Check that the inactive tokens are correct
    cy.get('@deactivatedTokens').then(($deactivatedTokens) => {
      const deactivatedTokens = bigNumberify(
        $deactivatedTokens.split(' ')[0].split(',').join(''),
      )
        .sub(amountToDeactivate)
        .toString();

      cy.getBySel('inactiveTokens', { timeout: 60000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0].split(',').join('');
        expect(tokens).to.eq(deactivatedTokens);
      });
    });
  });
});
