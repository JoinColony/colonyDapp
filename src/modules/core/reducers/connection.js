/* @flow */

import type { ConnectionStatsRecord } from '~immutable';

import { ConnectionStats } from '~immutable';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

const connectionStatsReducer: ReducerType<
  ConnectionStatsRecord,
  {|
    CONNECTION_STATS_SUB_EVENT: *,
  |},
> = (state = ConnectionStats(), action) => {
  switch (action.type) {
    case ACTIONS.CONNECTION_STATS_SUB_EVENT:
      return ConnectionStats(action.payload);
    default:
      return state;
  }
};

export default connectionStatsReducer;
