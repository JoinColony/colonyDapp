/* eslint-disable max-classes-per-file */

import { Record, Set as ImmutableSet } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

// ConnectionStats
interface ConnectionStatsRecordProps {
  busyStores: string[];
  openStores: number;
  ping: number;
  pinners: string[];
  pinnerBusy: boolean;
  swarmPeers: string[];
  pubsubPeers: string[];
}

const statsDefaultValues: DefaultValues<ConnectionStatsRecordProps> = {
  busyStores: [],
  openStores: 0,
  ping: Infinity,
  pinners: [],
  pinnerBusy: false,
  swarmPeers: [],
  pubsubPeers: [],
};

export class ConnectionStatsRecord extends Record<ConnectionStatsRecordProps>(
  statsDefaultValues,
) {}

export const ConnectionStats = (p?: ConnectionStatsRecordProps) =>
  new ConnectionStatsRecord(p);

// ConnectionError
interface ConnectionErrorRecordProps {
  error: Error | void;
  scope: string;
}
const errorDefaultValues: DefaultValues<ConnectionErrorRecordProps> = {
  error: undefined,
  scope: undefined,
};

export class ConnectionErrorRecord extends Record<ConnectionErrorRecordProps>(
  errorDefaultValues,
) {}

export const ConnectionError = (p: ConnectionErrorRecordProps) =>
  new ConnectionErrorRecord(p);

// Connection
interface ConnectionRecordProps {
  stats: ConnectionStatsRecord;
  errors: ImmutableSet<ConnectionErrorRecord>;
}

const defaultValues: DefaultValues<ConnectionRecordProps> = {
  stats: ConnectionStats(),
  errors: ImmutableSet(),
};

export class ConnectionRecord
  extends Record<ConnectionRecordProps>(defaultValues)
  implements RecordToJS<ConnectionType> {}

export const Connection = (p?: ConnectionRecordProps) =>
  new ConnectionRecord(p);

// JS types
export type ConnectionStatsType = ConnectionStatsRecordProps;
export type ConnectionErrorType = ConnectionErrorRecordProps;
export type ConnectionType = Readonly<{
  stats: ConnectionStatsRecordProps;
  errors: ConnectionErrorRecordProps[];
}>;
