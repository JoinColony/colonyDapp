/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, Map } from 'immutable';

import Token from './Token';

import type { Address, ENSName } from '~types';
import type { TokenRecord, ColonyAdminRecord } from './index';

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
  admins?: Map<string, ColonyAdminRecord>,
};

export type ColonyRecord = RecordOf<ColonyProps>;

const defaultAadmins: Map<string, ColonyAdminRecord> = Map();

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
  admins: defaultAadmins,
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export default Colony;
