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
  avatarHash?: string,
  colonyAddress: Address,
  colonyName: ENSName,
  description?: string,
  displayName: string,
  guideline?: string,
  id?: number,
  inRecoveryMode?: boolean,
  version?: number,
  website?: string,
|};

export type ColonyType = $ReadOnly<{|
  ...Shared,
  tokens?: { [tokenAddress: Address]: TokenReferenceType },
|}>;

export type ColonyProps<T> = $Pick<ColonyType, $Exact<T>>;

type ColonyRecordProps = {|
  ...Shared,
  tokens?: ImmutableMapType<Address, TokenReferenceRecordType>,
|};

const defaultValues: $Shape<ColonyRecordProps> = {
  avatarHash: undefined,
  colonyAddress: undefined,
  colonyName: undefined,
  description: undefined,
  displayName: undefined,
  guideline: undefined,
  id: undefined,
  inRecoveryMode: false,
  tokens: ImmutableMap(),
  version: undefined,
  website: undefined,
};

const ColonyRecord: RecordFactory<ColonyRecordProps> = Record(defaultValues);

export type ColonyRecordType = RecordOf<ColonyRecordProps>;

export default ColonyRecord;
