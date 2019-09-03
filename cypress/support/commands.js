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

Cypress.Commands.add('goToUserProfile', () => {
  cy.goToDashboard();
  /*
   * Click the Avatar Dropdown
   */
  cy.get('button[data-test="avatarDropdown"]').click();
  /*
   * Click Settings Link
   */
  cy.get('a[data-test="userProfile"]').click();
});

Cypress.Commands.add(
  'uploadAvatar',
  { prevSubject: 'element' },
  (selector, fileName, optionalType = 'image/jpeg') =>
    cy
      .fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob =>
        cy.window().then(win => {
          const file = new win.File([blob], fileName, { type: optionalType });
          const dataTransfer = new win.DataTransfer();
          dataTransfer.items.add(file);

          return cy.wrap(selector).trigger('drop', {
            dataTransfer,
          });
        }),
      ),
);

Cypress.Commands.add(
  'checkImage',
  { prevSubject: 'element' },
  (selector, fileName, optionalType = 'image/jpeg') =>
    cy
      .fixture(fileName, 'base64')
      .then(base64image =>
        cy
          .wrap(selector)
          .should(
            'have.attr',
            'style',
            `background-image: url("data:${optionalType};base64,${base64image}");`,
          ),
      ),
);

Cypress.Commands.add('confirmTx', () => {
  cy.get('button[data-test="gasStationConfirmTransaction"]', {
    timeout: 60000,
  }).click();
});

Cypress.Commands.add('verifyTxByIndex', index => {
  cy.get('span[data-test="gasStationTransactionSucceeded"]', {
    timeout: 120000,
  });
  cy.log(index);
});

Cypress.Commands.add('initState', () => {
  /*
   * Dev Helper method to reset the state with no currentUser set
   */
  cy.fixture('initialState').then(initState => {
    cy.visit('/connect', {
      onBeforeLoad: win => {
        // eslint-disable-next-line eslint-comments/disable-enable-pair
        /* eslint-disable no-param-reassign */
        win.initialState = initState;
      },
    });
  });
});

Cypress.Commands.add('getState', () => {
  cy.window()
    .its('store')
    .invoke('getState')
    .then(state => state.toJS());
});

/* This works only after colonyDapp#755 has been merged */
Cypress.Commands.add('logout', () => {
  /*
   * Dev Helper method to logout
   */
  cy.window()
    .its('store')
    .invoke('dispatch', { type: 'USER_LOGOUT' });
});
