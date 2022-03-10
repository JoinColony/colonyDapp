import { Extension } from '@colony/colony-js';

const testExtensionManagementFlow = extensionId => {
  // Can install extension
  cy.getBySel('install-extension-button').click().wait(5000);
  cy.getBySel('extension-status-tag').should(
    'have.text',
    'Disabled',
  );

  // Can enable extension
  cy.getBySel('close-gas-station-button').click();
  cy.getBySel('enable-extension-button').click();
  if (extensionId === Extension.Whitelist) {
    cy.getBySel('policy-selector').eq(1).click({ force: true });
  }
  cy.getBySel('setup-extension-confirm-button').click().wait(5000);;
  cy.getBySel('extension-status-tag').should(
    'have.text',
    'Enabled',
  );

  // Can deprecate extension
  cy.getBySel('deprecate-extension-button').click();
  cy.getBySel('confirm-button').click().wait(15000);
  cy.getBySel('extension-status-tag').last().should(
    'have.text',
    'Deprecated',
  );

  // Can re-enable extension
  cy.getBySel('reenable-extension-button').click();
  cy.getBySel('confirm-button').click().wait(5000);
  cy.getBySel('extension-status-tag').should(
    'have.text',
    'Enabled',
  );

  // Can uninstall extension
  cy.getBySel('deprecate-extension-button').click();
  cy.getBySel('confirm-button').click();
  cy.getBySel('uninstall-extension-button', { timeout: 20000 }).click();
  cy.getBySel('uninstall-warning-input').click().type("I UNDERSTAND");
  cy.getBySel('uninstall-confirm-button').click().wait(5000);
  cy.getBySel('extension-status-tag').should(
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
      cy.getBySel('extensions-navigation-button', { timeout: 60000 }).click({ force: true });
    });

    it('User with permission can install, enable, deprecate, re-enable, and uninstall the Voting Reputation extension', () => {
      cy.getBySel('voting-reputation-extension-card', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.VotingReputation);
    });

    it('User with permission can install, enable, deprecate, re-enable, and uninstall the Whitelist extension', () => {
      cy.getBySel('whitelist-extension-card', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.Whitelist);
    });

    it('User with permission can install, enable, deprecate, re-enable, and uninstall the Coin Machine extension', () => {
      cy.getBySel('coin-machine-extension-card', { timeout: 80000 }).click();
      testExtensionManagementFlow(Extension.CoinMachine);
    });
  },
);
