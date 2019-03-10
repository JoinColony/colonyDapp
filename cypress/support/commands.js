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
