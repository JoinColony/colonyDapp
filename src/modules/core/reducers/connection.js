/* @flow */

import type { ConnectionRecordType } from '~immutable';

import { Connection, ConnectionStats, ConnectionError } from '~immutable';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

import { CORE_CONNECTION_STATS, CORE_CONNECTION_ERRORS } from '../constants';

const connectionStatsReducer: ReducerType<
  ConnectionRecordType,
  {|
    CONNECTION_STATS_SUB_EVENT: *,
    CONNECTION_STATS_SUB_ERROR: *,
  |},
> = (state = Connection(), action) => {
  switch (action.type) {
    case ACTIONS.CONNECTION_STATS_SUB_EVENT:
      // Should the errors be unset here?
      return state.set(CORE_CONNECTION_STATS, ConnectionStats(action.payload));
    case ACTIONS.CONNECTION_STATS_SUB_ERROR:
      return state.update(CORE_CONNECTION_ERRORS, errors =>
        errors.add(
          ConnectionError({
            error: action.payload,
            scope: action.meta.scope,
          }),
        ),
      );
    default:
      return state;
  }
};

export default connectionStatsReducer;
