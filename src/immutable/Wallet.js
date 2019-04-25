/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

export type WalletProps = {|
  availableAddresses?: Address[],
  currentAddress?: Address,
  isLoading: boolean,
|};

export type WalletPropsJS = $ReadOnly<WalletProps>;

export type WalletRecordType = RecordOf<WalletProps>;

const defaultValues: $Shape<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: undefined,
};

const WalletRecord: RecordFactory<WalletProps> = Record(defaultValues);

export default WalletRecord;
