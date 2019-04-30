/*
 * Connect to the dApp
 */
const connectToDapp = before(() => {
  cy.log('Connected to the dApp');
  /*  Set initial state before starting tests */
  cy.visit('/connect');
});

export default connectToDapp;
