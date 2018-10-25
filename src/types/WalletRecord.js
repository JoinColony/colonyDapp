/* @flow */

import type { RecordOf } from 'immutable';

export type WalletProps = {
  currentAddress?: string,
};

export type WalletRecord = RecordOf<WalletProps>;
