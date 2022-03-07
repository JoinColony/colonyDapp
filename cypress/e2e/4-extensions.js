import { Extension } from '@colony/colony-js';

const testExtensionManagementFlow = extensionId => {
  // Can install extension
  cy.get('[data-test=install-extension-button]').click().wait(5000);
  cy.get('[data-test=extension-status-tag]').should(
    'have.text',
    'Disabled',
  );

  // Can enable extension
  cy.get('[data-test=close-gas-station-button]').click();
  cy.get('[data-test=enable-extension-button]').click();
  if (extensionId === Extension.Whitelist) {
    cy.get('[data-test=policy-selector]').eq(1).click({ force: true });
  }
  cy.get('[data-test=setup-extension-confirm-button]').click().wait(5000);;
  cy.get('[data-test=extension-status-tag]').should(
    'have.text',
    'Enabled',
  );

  // Can deprecate extension
  cy.get('[data-test=deprecate-extension-button]').click();
  cy.get('[data-test=confirm-button]').click().wait(15000);
  cy.get('[data-test=extension-status-tag]').last().should(
    'have.text',
    'Deprecated',
  );

  // Can re-enable extension
  cy.get('[data-test=reenable-extension-button]').click();
  cy.get('[data-test=confirm-button]').click().wait(5000);
  cy.get('[data-test=extension-status-tag]').should(
    'have.text',
    'Enabled',
  );

  // Can uninstall extension
  cy.get('[data-test=deprecate-extension-button]').click();
  cy.get('[data-test=confirm-button]').click();
  cy.get('[data-test=uninstall-extension-button]', { timeout: 20000 }).click();
  cy.get('[data-test=uninstall-warning-input]').click().type("I UNDERSTAND");
  cy.get('[data-test=uninstall-confirm-button]').click().wait(5000);
  cy.get('[data-test=extension-status-tag]').should(
    'have.text',
    'Not installed',
  );
};

describe(
  'Colony extensions',
  { defaultCommandTimeout: 10000 },
  () => {
    beforeEach(() => {
      cy.login();
      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.get('[data-test=extensions-navigation-button]', { timeout: 60000 }).click({ force: true });
    });

    it('User with permission can install, enable, deprecate, re-enable, and uninstall the Voting Reputation extension', () => {
      cy.get('[data-test=voting-reputation-extension-card]', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.VotingReputation);
    });

    it.only('User with permission can install, enable, deprecate, re-enable, and uninstall the Whitelist extension', () => {
      cy.get('[data-test=whitelist-extension-card]', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.Whitelist);
    });

    it('User with permission can install, enable, deprecate, re-enable, and uninstall the Coin Machine extension', () => {
      cy.get('[data-test=coin-machine-extension-card]', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.CoinMachine);
    });
  },
);
