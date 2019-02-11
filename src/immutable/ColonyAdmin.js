/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address, ENSName } from '../types';

type Shared = {|
  avatar?: string,
  displayName: string,
  profileStore: string,
  state: 'pending' | 'confirmed',
  username: ENSName,
  walletAddress: Address,
|};

export type ColonyAdminType = $ReadOnly<Shared>;

export type ColonyAdminRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  avatar: undefined,
  displayName: undefined,
  profileStore: undefined,
  state: 'pending',
  username: undefined,
  walletAddress: undefined,
};

const ColonyAdminRecord: RecordFactory<Shared> = Record(defaultProps);

export default ColonyAdminRecord;
