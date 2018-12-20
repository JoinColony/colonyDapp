/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address, ENSName } from '../types';

export type ColonyAdminProps = {
  displayName: string,
  profileStore: string,
  username: ENSName,
  walletAddress: Address,
};

export type ColonyAdminRecord = RecordOf<ColonyAdminProps>;

const defaultProps: ColonyAdminProps = {
  displayName: '',
  profileStore: '',
  username: '',
  walletAddress: '',
};

const ColonyAdmin: RecordFactory<ColonyAdminProps> = Record(defaultProps);

export default ColonyAdmin;
