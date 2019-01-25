/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address, ENSName } from '../types';

export type ColonyAdminProps = {
  avatar?: string,
  displayName: string,
  profileStore: string,
  username: ENSName,
  walletAddress: Address,
};

export type ColonyAdminRecord = RecordOf<ColonyAdminProps>;

const defaultProps: $Shape<ColonyAdminProps> = {
  avatar: undefined,
  displayName: undefined,
  profileStore: undefined,
  username: undefined,
  walletAddress: undefined,
};

const ColonyAdmin: RecordFactory<ColonyAdminProps> = Record(defaultProps);

export default ColonyAdmin;
