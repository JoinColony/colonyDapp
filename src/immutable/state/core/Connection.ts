import { $ReadOnly } from 'utility-types';

import { RecordOf, Record, Set as ImmutableSet } from 'immutable';

// ConnectionStats
interface ConnectionStatsRecordProps {
  busyStores: string[];
  error: Error | void;
  openStores: number;
  ping: number;
  pinners: string[];
  pinnerBusy: boolean;
  swarmPeers: string[];
  pubsubPeers: string[];
}
const statsDefaultValues: ConnectionStatsRecordProps = {
  busyStores: [],
  error: undefined,
  openStores: 0,
  ping: Infinity,
  pinners: [],
  pinnerBusy: false,
  swarmPeers: [],
  pubsubPeers: [],
};
export const ConnectionStats: Record.Factory<
  ConnectionStatsRecordProps
> = Record(statsDefaultValues);
export type ConnectionStatsRecordType = RecordOf<ConnectionStatsRecordProps>;

// ConnectionError
interface ConnectionErrorRecordProps {
  error: Error | void;
  scope: string;
}
const errorDefaultValues: ConnectionErrorRecordProps = {
  error: undefined,
  scope: undefined,
};
export const ConnectionError: Record.Factory<
  ConnectionErrorRecordProps
> = Record(errorDefaultValues);
export type ConnectionErrorRecordType = RecordOf<ConnectionErrorRecordProps>;

// Connection
interface ConnectionRecordProps {
  stats: ConnectionStatsRecordType;
  errors: ImmutableSet<ConnectionErrorRecordType>;
}
const defaultValues: ConnectionRecordProps = {
  stats: ConnectionStats(),
  errors: ImmutableSet(),
};
export const ConnectionRecord: Record.Factory<ConnectionRecordProps> = Record(
  defaultValues,
);
export type ConnectionRecordType = RecordOf<ConnectionRecordProps>;

// JS types
export type ConnectionStatsType = ConnectionStatsRecordProps;
export type ConnectionErrorType = ConnectionErrorRecordProps;
export type ConnectionType = $ReadOnly<{
  stats: ConnectionStatsRecordProps;
  errors: ConnectionErrorRecordProps[];
}>;
