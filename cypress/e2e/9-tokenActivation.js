import Decimal from 'decimal.js';

const {
  colony: { name: colonyName },
} = Cypress.config();

describe('Token Activation & Deactivation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);
  });

  it(`User can activate tokens`, () => {
    // Open Token Activation popover
    const amountToActivate = 10;

    // Activate tokens
    cy.tokenActivation(amountToActivate);

    // Check that the active tokens are correct
    cy.get('@activatedTokens').then(($activatedTokens) => {
      const [activatedTokensElement] = $activatedTokens.split(' ');
      const parsedActivated = activatedTokensElement.replaceAll(',', '');
      const activatedTokens = new Decimal(parsedActivated)
        .add(amountToActivate)
        .toString();

      cy.getBySel('activeTokens', { timeout: 6000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0].split(',').join('');
        expect(tokens).to.eq(activatedTokens);
      });
    });
  });

  it(`User can deactivate tokens`, () => {
    // Open Token Activation popover
    const amountToDeactivate = 10;
    cy.getBySel('tokenActivationButton', { timeout: 12000 }).click();

    // Get the number of inactive tokens
    cy.getBySel('inactiveTokens', { timeout: 6000 })
      .invoke('text')
      .as('deactivatedTokens');

    cy.getBySel('deactivateTokensToggle').click();

    cy.getBySel('activateTokensInput').click().type(amountToDeactivate);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('tokenActivationConfirm').click().wait(8000);

    // Check that the inactive tokens are correct
    cy.get('@deactivatedTokens').then(($deactivatedTokens) => {
      const [deactivatedTokensElement] = $deactivatedTokens.split(' ');
      const parsedDeactivated = deactivatedTokensElement.replaceAll(',', '');
      const deactivatedTokens = new Decimal(parsedDeactivated)
        .sub(amountToDeactivate)
        .toString();

      cy.getBySel('inactiveTokens', { timeout: 6000 }).then(($tokens) => {
        const tokens = $tokens.text().split(' ')[0].split(',').join('');
        expect(tokens).to.eq(deactivatedTokens);
      });
    });
  });
});
