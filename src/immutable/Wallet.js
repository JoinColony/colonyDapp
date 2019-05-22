/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export type WalletProps = {|
  availableAddresses?: Address[],
  currentAddress?: Address,
  isLoading: boolean,
  walletType: 'software' | 'metamask' | 'hardware',
|};

export type WalletPropsJS = $ReadOnly<WalletProps>;

export type WalletRecordType = RecordOf<WalletProps>;

const defaultValues: $Shape<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: undefined,
  walletType: 'software',
};

const WalletRecord: RecordFactory<WalletProps> = Record(defaultValues);

export default WalletRecord;
