import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

interface Shared {
  canEnterRecoveryMode: boolean;
  isAdmin: false;
  isFounder: false;
}

export type UserPermissionsType = $ReadOnly<Shared>;

export type UserPermissionsRecordType = RecordOf<Shared>;

const defaultProps: Shared = {
  canEnterRecoveryMode: false,
  isAdmin: false,
  isFounder: false,
};

export const UserPermissionsRecord: Record.Factory<Shared> = Record(
  defaultProps,
);

export default UserPermissionsRecord;
