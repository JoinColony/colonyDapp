/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type ConnectionStatsProps = {
  ping: number,
  pinners: string[],
  pinnerBusy: boolean,
  swarmPeers: string[],
  pubsubPeers: string[],
};

const defaultValues: $Shape<ConnectionStatsProps> = {
  ping: Infinity,
  pinners: [],
  pinnerBusy: false,
  swarmPeers: [],
  pubsubPeers: [],
};

const ConnectionStats: RecordFactory<ConnectionStatsProps> = Record(
  defaultValues,
);

export type ConnectionStatsRecord = RecordOf<ConnectionStatsProps>;

export default ConnectionStats;
