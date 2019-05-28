/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  readUntil?: number,
  exceptFor?: string[],
|};

export type UserNotificationMetadataType = $ReadOnly<Shared>;

export type UserNotificationMetadataRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  readUntil: undefined,
  exceptFor: undefined,
};

const UserNotificationMetadataRecord: RecordFactory<Shared> = Record(
  defaultProps,
);

export default UserNotificationMetadataRecord;
