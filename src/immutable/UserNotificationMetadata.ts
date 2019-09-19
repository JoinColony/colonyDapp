import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

type Shared = {
  readUntil?: number;
  exceptFor?: string[];
};

export type UserNotificationMetadataType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  readUntil: undefined,
  exceptFor: undefined,
};

export class UserNotificationMetadataRecord extends Record<Shared>(
  defaultValues,
) {}

export const UserNotificationMetadata = (p?: Shared) =>
  new UserNotificationMetadataRecord(p);
