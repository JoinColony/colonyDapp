/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { WalletProps } from '~types';

const defaultValues: WalletProps = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: false,
};

const Wallet: RecordFactory<WalletProps> = Record(defaultValues);

export default Wallet;
