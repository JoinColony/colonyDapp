/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record, Set as ImmutableSet } from 'immutable';

// ConnectionStats
type ConnectionStatsRecordProps = {|
  busyStores: string[],
  error: Error,
  openStores: number,
  ping: number,
  pinners: string[],
  pinnerBusy: boolean,
  swarmPeers: string[],
  pubsubPeers: string[],
|};
const statsDefaultValues: $Shape<ConnectionStatsRecordProps> = {
  busyStores: [],
  openStores: 0,
  ping: Infinity,
  pinners: [],
  pinnerBusy: false,
  swarmPeers: [],
  pubsubPeers: [],
};
export const ConnectionStats: RecordFactory<ConnectionStatsRecordProps> = Record(
  statsDefaultValues,
);
export type ConnectionStatsRecordType = RecordOf<ConnectionStatsRecordProps>;

// ConnectionError
type ConnectionErrorRecordProps = {|
  error: Error,
  scope: string,
|};
const errorDefaultValues: $Shape<ConnectionErrorRecordProps> = {
  error: undefined,
  scope: undefined,
};
export const ConnectionError: RecordFactory<ConnectionErrorRecordProps> = Record(
  errorDefaultValues,
);
export type ConnectionErrorRecordType = RecordOf<ConnectionErrorRecordProps>;

// Connection
type ConnectionRecordProps = {|
  stats: ConnectionStatsRecordType,
  errors: ImmutableSet<ConnectionErrorRecordType>,
|};
const defaultValues: $Shape<ConnectionRecordProps> = {
  stats: ConnectionStats(),
  errors: ImmutableSet(),
};
const ConnectionRecord: RecordFactory<ConnectionRecordProps> = Record(
  defaultValues,
);
export type ConnectionRecordType = RecordOf<ConnectionRecordProps>;

// JS types
export type ConnectionStatsType = ConnectionStatsRecordProps;
export type ConnectionErrorType = ConnectionErrorRecordProps;
export type ConnectionType = $ReadOnly<{|
  stats: ConnectionStatsRecordProps,
  errors: ConnectionErrorRecordProps[],
|}>;

export default ConnectionRecord;
