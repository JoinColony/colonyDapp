import { ContextModule, TEMP_getContext } from '~context/index';
import { SlotKey, UserSettingsSlot } from '~context/userSettings';

interface UserSettingsHook {
  settings: UserSettingsSlot;
  setSettingsKey: <K extends SlotKey>(
    key: K,
    value: UserSettingsSlot[K],
  ) => UserSettingsSlot[K];
  getSettingsKey: <K extends SlotKey>(key: K) => UserSettingsSlot[K];
}

export { SlotKey };

export const useUserSettings = (): UserSettingsHook => {
  const userSettings = TEMP_getContext(ContextModule.UserSettings);
  const setSettingsKey = <K extends SlotKey>(
    key: K,
    value: UserSettingsSlot[K],
  ): UserSettingsSlot[K] =>
    userSettings.setSlotStorageAtKey(key, value) as UserSettingsSlot[K];
  const getSettingsKey = <K extends SlotKey>(key: K): UserSettingsSlot[K] =>
    userSettings.getSlotStorageAtKey(key) as UserSettingsSlot[K];
  return {
    settings: userSettings.getStorageSlot() as UserSettingsSlot,
    setSettingsKey,
    getSettingsKey,
  };
};
