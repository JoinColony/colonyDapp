/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import BN from 'bn.js';

import { Record } from 'immutable';

type Shared = {|
  id?: string,
  comment?: string,
  taskTitle?: string,
  event: string,
  unread?: boolean,
  timestamp?: Date | number,
  colonyName?: string,
  colonyAddress?: string,
  domainName?: string,
  domainId?: number,
  amount?: BN,
  tokenAddress?: string,
  sourceUserAddress?: string,
  targetUserAddress?: string,
|};

export type UserActivityType = $ReadOnly<Shared>;

export type UserActivityRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  comment: undefined,
  taskTitle: undefined,
  event: undefined,
  unread: true,
  timestamp: new Date(),
  colonyName: undefined,
  colonyAddress: undefined,
  domainName: undefined,
  domainId: undefined,
  amount: undefined,
  tokenAddress: undefined,
  sourceUserAddress: undefined,
  targetUserAddress: undefined,
};

const UserActivityRecord: RecordFactory<Shared> = Record(defaultValues);

export default UserActivityRecord;
