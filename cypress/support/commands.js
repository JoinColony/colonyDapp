// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { buildUser } from './generate';

Cypress.Commands.add('login', () => {
  cy.visit('/landing');
  cy.findByText(/connect wallet/i).click();
  cy.contains(/ganache/i).click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByText(/continue/i)
    .click()
    .wait(3000);
});

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/landing`);
});

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('claimNewUserName', (numberFromList) => {
  const user = buildUser();

  cy.visit('/')
    .contains(/connect wallet/i)
    .click();

  cy.contains(/ganache/i)
    .click()
    // click on drowpdown with accounts
    // using this type of selector not to pollute Select component that is reused
    .get('.Select_activeOption_1sMcrZHH > span')
    .click()
    // select last account
    /*
      This will once for each address from the dropdown as the username will be already created.
    */
    .get(
      `#privateKey-listbox-entry-${numberFromList} > .SelectOption_value_1zTMGGfo`,
    )
    .click();
  // click continue
  cy.findByText(/continue/i).click();
  // click on Avatar
  cy.getBySel('avatar').click();
  // click get started to be redirected to claim username page
  cy.findByText(/get started/i).click();

  // I don't think it's worth to add selector to the Input component as it is used multiple times on the page
  cy.get('.Input_container_17sAGJ_F').click().type(user.username);

  cy.findByText(/continue/i).click();
});
