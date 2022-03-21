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
    });

    it('User with permission can update their profile fields', () => {
      cy.visit(`/edit-profile`, { timeout: 40000 }).wait(5000);
      // Add all fields and save
      cy.getBySel('userSettingsName').click().type(userSettingsName);
      cy.getBySel('userSettingsBio').click().type(userSettingsBio);
      cy.getBySel('userSettingsWebsite').click().type(userSettingsWebsite);
      cy.getBySel('userSettingsLocation').click().type(userSettingsLocation);
      cy.getBySel('userSettingsSubmit').click();

      // Reload the profile page
      cy.visit(`/edit-profile`, { timeout: 40000 });

      // Check all the fields saved
      cy.getBySel('userSettingsName').should('have.text', userSettingsName);
      cy.getBySel('userSettingsBio').should('have.text', userSettingsBio);
      cy.getBySel('userSettingsWebsite').should('have.text', userSettingsWebsite);
      cy.getBySel('userSettingsLocation').should('have.text', userSettingsLocation);
    });

    it('User with permission can upload and remove profile picture', () => {
      cy.visit(`/edit-profile`, { timeout: 40000 });
      cy.getBySel('avatarUploaderChoose').selectFile(profilePicturePath, { action: 'drag-drop' });
      cy.getBySel('avatarUploaderChoose').trigger('drop', { force: true });
      cy.getBySel('avatarUploaderRemove').click();
    });
  },
);