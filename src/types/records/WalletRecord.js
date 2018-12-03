/* @flow */

import type { RecordOf } from 'immutable';

export type WalletProps = {
  availableAddresses?: string[],
  currentAddress?: string,
  isLoading: boolean,
};

export type WalletRecord = RecordOf<WalletProps>;
