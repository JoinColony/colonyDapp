/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';
import type BigNumber from 'bn.js';

import { Record } from 'immutable';

export type NetworkProps = {
  feeInverse?: BigNumber,
  version?: number,
};

const defaultValues: $Shape<NetworkProps> = {
  feeInverse: undefined,
  version: undefined,
};

const Network: RecordFactory<NetworkProps> = Record(defaultValues);

export type NetworkRecord = RecordOf<NetworkProps>;

export default Network;
