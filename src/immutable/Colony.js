/* @flow */

import type {
  RecordFactory,
  RecordOf,
  Map as ImmutableMapType,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { $Pick, Address, ENSName } from '~types';
import type { TokenReferenceRecordType, TokenReferenceType } from './index';

type Shared = {|
  address: Address,
  avatarHash?: string,
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  version?: number,
  website?: string,
  inRecoveryMode?: boolean,
|};

export type ColonyType = $ReadOnly<{|
  ...Shared,
  tokens?: { [address: Address]: TokenReferenceType },
|}>;

export type ColonyProps<T> = $Pick<ColonyType, $Exact<T>>;

type ColonyRecordProps = {|
  ...Shared,
  tokens?: ImmutableMapType<Address, TokenReferenceRecordType>,
|};

const defaultValues: $Shape<ColonyRecordProps> = {
  address: undefined,
  avatarHash: undefined,
  description: undefined,
  ensName: undefined,
  guideline: undefined,
  id: undefined,
  inRecoveryMode: false,
  name: undefined,
  tokens: ImmutableMap(),
  version: undefined,
  website: undefined,
};

const ColonyRecord: RecordFactory<ColonyRecordProps> = Record(defaultValues);

export type ColonyRecordType = RecordOf<ColonyRecordProps>;

export default ColonyRecord;
