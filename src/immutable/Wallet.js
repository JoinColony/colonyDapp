/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export type WalletProps = {
  availableAddresses?: Address[], // TODO use List?
  currentAddress?: Address,
  isLoading: boolean,
};

export type WalletRecord = RecordOf<WalletProps>;

const defaultValues: $Shape<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: undefined,
};

const Wallet: RecordFactory<WalletProps> = Record(defaultValues);

export default Wallet;
