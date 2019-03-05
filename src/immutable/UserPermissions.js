/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  canEnterRecoveryMode: boolean,
|};

export type UserPermissionsType = $ReadOnly<Shared>;

export type UserPermissionsRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  canEnterRecoveryMode: false,
};

const UserPermissionsRecord: RecordFactory<Shared> = Record(defaultProps);

export default UserPermissionsRecord;
