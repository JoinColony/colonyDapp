import localForage from 'localforage';

/*
 * Removes every item in the localForage offline store (indexedDB)
 */
const localForageClear = before(() => {
  localForage.clear();
  cy.log('Cleared the `localForage` offline storage');
});

export default localForageClear;
