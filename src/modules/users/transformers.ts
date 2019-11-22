import { UsersMapType } from './state/index';

export const getUserPickerData = (userData: UsersMapType) =>
  Object.entries(userData)
    .filter(([, { record }]) => !!(record && record.profile))
    .map(([address, { record }]) => ({
      id: address,
      ...record,
    }));
