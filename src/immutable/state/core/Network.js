/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type NetworkProps = {
  /*
   * Current network fee, calculated using `feeInverse`.
   * If the current fee is 1%, this will be `.01`.
   */
  fee?: number,
  /*
   * Network fee inverse as defined by the ColonyNetwork contract.
   * If the current fee is 1%, this will be `100`.
   */
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
