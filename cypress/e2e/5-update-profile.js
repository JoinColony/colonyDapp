import { Extension } from '@colony/colony-js';

describe(
  'Colony user can update their profile',
  () => {
    const userSettingsName = 'ColonyFan';
    const userSettingsBio = 'I really like Colony';
    const userSettingsWebsite = 'http://colony.io';
    const userSettingsLocation = 'Earth';
    const profilePicturePath = 'src/img/favicon.png';

    beforeEach(() => {
      cy.login();
      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.getBySel('avatarDropdown', { timeout: 40000 }).click();
      cy.getBySel('userProfileSettings', { timeout: 40000 }).click();
    });

    it('User with permission can update their profile fields', () => {
      // Add all fields and save
      cy.getBySel('userSettingsName', { timeout: 40000 })
        .click()
        .type(userSettingsName);
      cy.getBySel('userSettingsBio', { timeout: 40000 })
        .click()
        .type(userSettingsBio);
      cy.getBySel('userSettingsWebsite', { timeout: 40000 })
        .click()
        .type(userSettingsWebsite);
      cy.getBySel('userSettingsLocation', { timeout: 40000 })
        .click()
        .type(userSettingsLocation);
      cy.getBySel('userSettingsSubmit', { timeout: 40000 }).click()

      // Reload the profile page
      cy.visit(`/edit-profile`);

      // Check all the fields saved
      cy.getBySel('userSettingsName', { timeout: 40000 })
        .should('have.text', userSettingsName);
      cy.getBySel('userSettingsBio', { timeout: 40000 })
        .should('have.text', userSettingsBio);
      cy.getBySel('userSettingsWebsite', { timeout: 40000 })
        .should('have.text', userSettingsWebsite);
      cy.getBySel('userSettingsLocation', { timeout: 40000 })
        .should('have.text', userSettingsLocation);
    });

    // it('User with permission can upload a profile picture', () => {
    //   cy.getBySel('whitelist-extension-card', { timeout: 80000 }).click();
    //   testExtensionManagementFlow(Extension.Whitelist);
    // });

    // it('User with permission can remove their profile picture', () => {
    //   cy.getBySel('whitelist-extension-card', { timeout: 80000 }).click();
    //   testExtensionManagementFlow(Extension.Whitelist);
    // });
  },
);