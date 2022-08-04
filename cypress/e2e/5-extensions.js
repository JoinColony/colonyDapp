import { Extension } from '@colony/colony-js';

const testExtensionManagementFlow = (extensionId) => {
  cy.installExtension();

  cy.enableExtension(extensionId);

  cy.deprecateExtension();

  // Can re-enable extension
  cy.getBySel('reenableExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('enabledStatusTag', { timeout: 30000 }).should('exist');

  cy.uninstallExtension();
};

describe('Colony extensions', () => {
  const {
    colony: { name: colonyName },
  } = Cypress.config();

  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${colonyName}`);
    cy.getBySel('extensionsNavigationButton', { timeout: 60000 }).click({
      force: true,
    });
  });

  it(`User with permission can install, enable, deprecate, re-enable,
  and uninstall the Voting Reputation extension`, () => {
    cy.getBySel('votingReputationExtensionCard', { timeout: 80000 }).click();
    testExtensionManagementFlow(Extension.VotingReputation);
  });
});
