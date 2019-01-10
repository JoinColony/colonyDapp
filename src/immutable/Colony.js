/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, Map } from 'immutable';

import Token from './Token';

import type { Address, ENSName } from '~types';
import type { TokenRecord, ColonyAdminRecord } from './index';

export type ColonyProps = {|
  address: Address,
  avatar?: string,
  databases: {
    domainsIndex: ?string,
  },
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  token?: TokenRecord,
  version?: number,
  website?: string,
  admins?: Map<string, ColonyAdminRecord>,
|};

const defaultAdmins: Map<string, ColonyAdminRecord> = Map();

const defaultValues: $Shape<ColonyProps> = {
  address: undefined,
  avatar: undefined,
  databases: {
    domainsIndex: undefined,
  },
  description: undefined,
  ensName: undefined,
  guideline: undefined,
  id: undefined,
  name: undefined,
  token: Token(),
  version: undefined,
  website: undefined,
  admins: defaultAdmins,
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export type ColonyRecord = RecordOf<ColonyProps>;

export default Colony;
