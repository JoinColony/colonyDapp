const USER_SETTINGS_STORAGE = 'userSettings';

export const setUserSettings = (settings) => {
  localStorage.setItem(
    USER_SETTINGS_STORAGE,
    JSON.stringify(settings),
  );
}

export const getUserSettings = () => {
  const settings = localStorage.getItem(
    USER_SETTINGS_STORAGE,
  );

  return settings && JSON.parse(settings);
}
