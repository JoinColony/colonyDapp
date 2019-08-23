import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

type Shared = {
  readUntil?: number;
  exceptFor?: string[];
};

export type UserNotificationMetadataType = $ReadOnly<Shared>;

export type UserNotificationMetadataRecordType = RecordOf<Shared>;

const defaultProps: Shared = {
  readUntil: undefined,
  exceptFor: undefined,
};

export const UserNotificationMetadataRecord: Record.Factory<Shared> = Record(
  defaultProps,
);

export default UserNotificationMetadataRecord;
