import { Record, Map as ImmutableMap } from 'immutable';

import { Address, DefaultValues, ENSName } from '~types/index';
import { TokenReferenceRecord, TokenReferenceType } from './index';

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

export type ColonyType = Readonly<
  Shared & {
    tokens?: {
      // Opaque implementation can't be used as an index type
      [tokenAddress: string]: TokenReferenceType;
    };
  }
>;

export type ColonyProps<T extends keyof ColonyType> = Pick<ColonyType, T>;

type ColonyRecordProps = Shared & {
  tokens?: ImmutableMap<Address, TokenReferenceRecord>;
};

const defaultValues: DefaultValues<ColonyRecordProps> = {
  avatarHash: undefined,
  canMintNativeToken: false,
  canUnlockNativeToken: false,
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

export class ColonyRecord extends Record<ColonyRecordProps>(defaultValues) {}

export const Colony = (p: ColonyRecordProps) => new ColonyRecord(p);
