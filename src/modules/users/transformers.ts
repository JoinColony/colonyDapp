import { KeyedDataObject } from '~types/index';
import { UserType } from '~immutable/index';

export const getUserPickerData = (
  userData: KeyedDataObject<UserType | null | undefined>[],
) =>
  userData
    .filter(({ data }) => !!data)
    .map(({ data, key }) => ({
      id: key,
      ...data,
    }));
