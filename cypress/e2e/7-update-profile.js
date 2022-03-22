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
      cy.visit(`/landing`);
      cy.getBySel('avatarDropdown').click();
      cy.getBySel('userProfileSettings').click();
    });

    it('User with permission can update their profile fields', () => {
      // Add all fields and save
      cy.getBySel('userSettingsName', { timeout: 40000 }).click().type(userSettingsName);
      cy.getBySel('userSettingsBio').click().type(userSettingsBio);
      cy.getBySel('userSettingsWebsite').click().type(userSettingsWebsite);
      cy.getBySel('userSettingsLocation').click().type(userSettingsLocation);
      cy.getBySel('userSettingsSubmit').click();

      // Reload the profile page
      cy.reload();
      cy.getBySel('avatarDropdown').click();
      cy.getBySel('userProfileSettings').click();

      // Check all the fields saved
      cy.getBySel('userSettingsName', { timeout: 40000 }).should('have.value', userSettingsName);
      cy.getBySel('userSettingsBio').should('have.value', userSettingsBio);
      cy.getBySel('userSettingsWebsite').should('have.value', userSettingsWebsite);
      cy.getBySel('userSettingsLocation').should('have.value', userSettingsLocation);
    });

    it('User with permission can upload and remove profile picture', () => {
      cy.getBySel('avatarUploaderDrop', { timeout: 40000 }).selectFile(profilePicturePath, { action: 'drag-drop' });
      cy.getBySel('avatarUploaderDrop').trigger('drop', { force: true });
      cy.getBySel('avatarUploaderRemove', { timeout: 40000 }).click();
    });
  },
);