/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import Token from './Token';

import type { Address, ENSName } from '~types';
import type { TokenRecord } from './index';

export type ColonyProps = {|
  address: Address,
  avatar?: string,
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  token?: TokenRecord,
  version?: number,
  website?: string,
|};

const defaultValues: $Shape<ColonyProps> = {
  address: undefined,
  avatar: undefined,
  description: undefined,
  ensName: undefined,
  guideline: undefined,
  id: undefined,
  name: undefined,
  token: Token(),
  version: undefined,
  website: undefined,
  admins: {},
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export type ColonyRecord = RecordOf<ColonyProps>;

export default Colony;
