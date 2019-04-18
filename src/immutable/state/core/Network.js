/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type NetworkProps = {
  feeInverse?: string,
  version?: number,
};

const defaultValues: $Shape<NetworkProps> = {
  feeInverse: undefined,
  version: undefined,
};

const Network: RecordFactory<NetworkProps> = Record(defaultValues);

export type NetworkRecord = RecordOf<NetworkProps>;

export default Network;
