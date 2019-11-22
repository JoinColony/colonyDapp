import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

interface Shared {
  readUntil?: number;
  exceptFor?: string[];
}

export type UserNotificationMetadataType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  readUntil: undefined,
  exceptFor: undefined,
};

export class UserNotificationMetadataRecord
  extends Record<Shared>(defaultValues)
  implements RecordToJS<UserNotificationMetadataType> {}

export const UserNotificationMetadata = (p?: Shared) =>
  new UserNotificationMetadataRecord(p);
