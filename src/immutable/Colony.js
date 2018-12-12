/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import Token from './Token';

import type { Address, ENSName } from '~types';
import type { TokenRecord } from './index';

export type ColonyProps = {
  address: Address,
  avatar?: string,
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  token: TokenRecord,
  version?: number,
  website?: string,
  rootDomain?: string,
};

export type ColonyRecord = RecordOf<ColonyProps>;

const defaultValues: ColonyProps = {
  address: '',
  avatar: undefined,
  description: undefined,
  ensName: '',
  guideline: undefined,
  id: undefined,
  name: '',
  token: Token(),
  version: undefined,
  website: undefined,
  rootDomain: undefined,
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export default Colony;
