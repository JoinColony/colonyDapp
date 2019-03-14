/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type NetworkProps = {
  version?: number,
};

const defaultValues: $Shape<NetworkProps> = {
  version: undefined,
};

const Network: RecordFactory<NetworkProps> = Record(defaultValues);

export type NetworkRecord = RecordOf<NetworkProps>;

export default Network;
