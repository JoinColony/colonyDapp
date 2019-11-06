import { UsersMapType } from './state/index';

export const getUserPickerData = (userData: UsersMapType) =>
  Object.entries(userData).map(([address, { record }]) => ({
    id: address,
    ...record,
  }));
