import Decimal from 'decimal.js';
import numbro from 'numbro';
import { numbroCustomLanguage } from '../../src/utils/numbers/numbroCustomLanguage';

describe('Token Activation & Deactivation', () => {
  const {
    colony: { name: colonyName },
  } = Cypress.config();
  numbro.registerLanguage(numbroCustomLanguage);
  numbro.setLanguage('en-GB');

  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);
  });

  it(`User can deactivate tokens`, () => {
    // Open Token Activation popover
    const amountToDeactivate = 10;
    cy.getBySel('tokenActivationButton', { timeout: 120000 }).click();

    // Get the number of inactive tokens
    cy.getBySel('inactiveTokens', { timeout: 6000 })
      .invoke('text')
      .as('deactivatedTokens');

    cy.getBySel('deactivateTokensToggle').click();

    cy.getBySel('activateTokensInput').click().type(amountToDeactivate);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('tokenActivationConfirm').click().wait(20000);

    // Check that the inactive tokens are correct
    cy.get('@deactivatedTokens').then(($deactivatedTokens) => {
      const [deactivedTokensElement] = $deactivatedTokens.split(' ');
      const parsedDeactivatedTokens = numbro.unformat(deactivedTokensElement);
      const deactivatedTokens = new Decimal(parsedDeactivatedTokens)
        .add(amountToDeactivate)
        .toFixed(0);

      cy.getBySel('inactiveTokens', { timeout: 6000 }).then(($tokens) => {
        const [inactiveTokensElement] = $tokens.text().split(' ');
        const parsedInactiveTokens = numbro.unformat(inactiveTokensElement);
        const fixInactiveTokens = new Decimal(parsedInactiveTokens).toFixed(0);
        expect(fixInactiveTokens).to.eq(deactivatedTokens);
      });
    });
  });

  it(`User can activate tokens`, () => {
    // Open Token Activation popover
    const amountToActivate = 10;

    // Activate tokens - wait required for reliability
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.activateTokens(amountToActivate).wait(20000);

    // Check that the active tokens are correct
    cy.get('@activatedTokens').then(($activatedTokens) => {
      const [activatedTokensElement] = $activatedTokens.split(' ');
      const parsedActivatedTokens = numbro.unformat(activatedTokensElement);
      const activatedTokens = new Decimal(parsedActivatedTokens)
        .add(amountToActivate)
        .toFixed(0);

      cy.getBySel('activeTokens', { timeout: 60000 }).then(($tokens) => {
        const [activeTokensElement] = $tokens.text().split(' ');
        const parsedActiveTokens = numbro.unformat(activeTokensElement);
        const fixActiveTokens = new Decimal(parsedActiveTokens).toFixed(0);
        expect(fixActiveTokens).to.eq(activatedTokens);
      });
    });
  });
});
