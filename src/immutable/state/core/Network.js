/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type NetworkProps = {
  fee?: number,
  feeInverse?: number,
  version?: number,
};

const defaultValues: $Shape<NetworkProps> = {
  fee: undefined,
  feeInverse: undefined,
  version: undefined,
};

const Network: RecordFactory<NetworkProps> = Record(defaultValues);

export type NetworkRecord = RecordOf<NetworkProps>;

export default Network;
