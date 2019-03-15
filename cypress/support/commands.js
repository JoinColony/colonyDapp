// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('goToDashboard', () => {
  /*
   * Use force, since this might be blocked by an opened modal
   */
  cy.get('a[data-test="goToDashboard"]').click({ force: true });
});

Cypress.Commands.add('getFirstTask', () => {
  cy.goToDashboard();
  /*
   * Go to the first task in the dashboard list
   */
  return cy.get('table[data-test="dashboardTaskList"] tr').first();
});

Cypress.Commands.add('goToUserProfileSettings', () => {
  cy.goToDashboard();
  /*
   * Click the Avatar Dropdown
   */
  cy.get('button[data-test="avatarDropdown"]').click();
  /*
   * Click Settings Link
   */
  cy.get('a[data-test="userProfileSettings"]').click();
});
