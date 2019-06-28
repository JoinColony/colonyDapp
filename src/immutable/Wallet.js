/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export const WALLET_TYPES = Object.freeze({
  SOFTWARE: 'software',
  METAMASK: 'metamask',
  HARDWARE: 'hardware',
});

/*
 * Yeah... I suck at naming things apparently
 */
export type WalletTypesType = $Values<typeof WALLET_TYPES>;

export type WalletProps = {|
  availableAddresses?: Address[],
  currentAddress?: Address,
  isLoading: boolean,
  walletType: WalletTypesType,
|};

export type WalletPropsJS = $ReadOnly<WalletProps>;

export type WalletRecordType = RecordOf<WalletProps>;

const defaultValues: $Shape<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: undefined,
  walletType: WALLET_TYPES.SOFTWARE,
};

const WalletRecord: RecordFactory<WalletProps> = Record(defaultValues);

export default WalletRecord;
