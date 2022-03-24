import { Extension } from '@colony/colony-js';

describe('Token Activation & Deactivation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`/colony/${Cypress.config().colony.name}`);
    cy.installExtension(Extension.VotingReputation);
  });

  it.only(`User can activate tokens`, () => {
    cy.getBySel('tokenActivationButton', { timeout: 80000 }).click();
    testExtensionManagementFlow(Extension.VotingReputation);
  });
});
