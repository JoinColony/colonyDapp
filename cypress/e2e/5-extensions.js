import { Extension } from '@colony/colony-js';

const testExtensionManagementFlow = (extensionId) => {
  // Can install extension
  cy.installExtension();

  // Can enable extension
  cy.enableExtension(extensionId);

  // Can deprecate extension
  cy.getBySel('deprecateExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('deprecatedStatusTag', { timeout: 30000 }).should('exist');

  // Can re-enable extension
  cy.getBySel('reenableExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('enabledStatusTag', { timeout: 30000 }).should('exist');

  // Can uninstall extension
  cy.getBySel('deprecateExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('uninstallExtensionButton', { timeout: 20000 }).click();
  cy.getBySel('uninstallWarningInput').click().type('I UNDERSTAND');
  cy.getBySel('uninstallConfirmButton').click();
  cy.getBySel('notInstalledStatusTag', { timeout: 30000 }).should('exist');
};

describe('Colony extensions', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });
  });

  it(`User with permission can install, enable, deprecate, re-enable,
  and uninstall the Voting Reputation extension`, () => {
    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();
    testExtensionManagementFlow(Extension.VotingReputation);
  });

  it(`User with permission can install, enable, deprecate, re-enable,
  and uninstall the Whitelist extension`, () => {
    cy.getBySel('whitelistExtensionCard', { timeout: 80000 }).click();
    testExtensionManagementFlow(Extension.Whitelist);
  });

  it(`User with permission can install, enable, deprecate, re-enable,
  and uninstall the Coin Machine extension`, () => {
    cy.getBySel('coinMachineExtensionCard', { timeout: 80000 }).click();
    testExtensionManagementFlow(Extension.CoinMachine);
  });
});
