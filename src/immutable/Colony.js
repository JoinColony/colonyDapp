/* @flow */

import type {
  RecordFactory,
  RecordOf,
  Map as ImmutableMapType,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { Address, ENSName } from '~types';
import type {
  TokenRecordType,
  TokenType,
  ColonyAdminRecordType,
  ColonyAdminType,
} from './index';

type Shared = {|
  address: Address,
  avatar?: string,
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  version?: number,
  website?: string,
|};

export type ColonyType = $ReadOnly<{|
  ...Shared,
  tokens?: { [tokenAddress: string]: TokenType },
  admins?: { [username: string]: ColonyAdminType },
|}>;

type ColonyRecordProps = {|
  ...Shared,
  tokens?: ImmutableMapType<string, TokenRecordType>,
  admins?: ImmutableMapType<string, ColonyAdminRecordType>,
|};

const defaultValues: $Shape<ColonyRecordProps> = {
  address: undefined,
  avatar: undefined,
  description: undefined,
  ensName: undefined,
  guideline: undefined,
  id: undefined,
  name: undefined,
  tokens: ImmutableMap(),
  version: undefined,
  website: undefined,
  admins: ImmutableMap(),
};

const ColonyRecord: RecordFactory<ColonyRecordProps> = Record(defaultValues);

export type ColonyRecordType = RecordOf<ColonyRecordProps>;

export default ColonyRecord;
