/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { WalletProps } from '~types/WalletRecord';

const defaultValues: WalletProps = {
  currentAddress: undefined,
};

const Wallet: RecordFactory<WalletProps> = Record(defaultValues);

export default Wallet;
