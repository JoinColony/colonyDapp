/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  id?: string,
  comment?: string,
  taskTitle?: string,
  userAddress?: string,
  otherUserAddress?: string,
  event: string,
  timestamp: Date,
  colonyName?: string,
  colonyAddress?: string,
  domainName?: string,
|};

export type UserActivityType = $ReadOnly<Shared>;

export type UserActivityRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  comment: undefined,
  taskTitle: undefined,
  userAddress: undefined,
  otherUserAddress: undefined,
  event: undefined,
  timestamp: new Date(),
  colonyName: undefined,
  colonyAddress: undefined,
  domainName: undefined,
};

const UserActivityRecord: RecordFactory<Shared> = Record(defaultValues);

export default UserActivityRecord;
