/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  inboxStoreAddress: string,
  metadataStoreAddress: string,
  profileStoreAddress: string,
|};

export type UserMetadataType = $ReadOnly<Shared>;

export type UserMetadataRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  inboxStoreAddress: undefined,
  metadataStoreAddress: undefined,
  profileStoreAddress: undefined,
};

const UserMetadataRecord: RecordFactory<Shared> = Record(defaultProps);

export default UserMetadataRecord;
