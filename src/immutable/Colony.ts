import { $ReadOnly } from 'utility-types';

import {
  RecordOf,
  Map as ImmutableMapType,
  Record,
  Map as ImmutableMap,
} from 'immutable';

import { Address, ENSName } from '~types/index';
// eslint-disable-next-line import/no-cycle
import { TokenReferenceRecordType, TokenReferenceType } from './index';

interface Shared {
  avatarHash?: string;
  canMintNativeToken?: boolean;
  canUnlockNativeToken?: boolean;
  colonyAddress: Address;
  colonyName: ENSName;
  description?: string;
  displayName: string;
  guideline?: string;
  id?: number;
  inRecoveryMode?: boolean;
  isNativeTokenLocked?: boolean;
  version?: number;
  website?: string;
}

export type ColonyType = $ReadOnly<
  Shared & {
    tokens?: {
      // Opaque implementation can't be used as an index type
      // [tokenAddress: Address]: TokenReferenceType;
      [tokenAddress: string]: TokenReferenceType;
    };
  }
>;

export type ColonyProps<T extends keyof ColonyType> = Pick<ColonyType, T>;

type ColonyRecordProps = Shared & {
  tokens?: ImmutableMapType<Address, TokenReferenceRecordType>;
};

const defaultValues: ColonyRecordProps = {
  avatarHash: undefined,
  canMintNativeToken: undefined,
  canUnlockNativeToken: undefined,
  colonyAddress: undefined,
  colonyName: undefined,
  description: undefined,
  displayName: undefined,
  guideline: undefined,
  id: undefined,
  inRecoveryMode: false,
  isNativeTokenLocked: undefined,
  tokens: ImmutableMap(),
  version: undefined,
  website: undefined,
};

export const ColonyRecord: Record.Factory<ColonyRecordProps> = Record(
  defaultValues,
);

export type ColonyRecordType = RecordOf<ColonyRecordProps>;

export default ColonyRecord;
