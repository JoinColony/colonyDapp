import {
  ConnectionRecordType,
  ConnectionRecord,
  ConnectionStats,
  ConnectionError,
} from '~immutable/index';

import { ActionTypes, ReducerType } from '~redux/index';

import { CORE_CONNECTION_STATS, CORE_CONNECTION_ERRORS } from '../constants';

const connectionStatsReducer: ReducerType<ConnectionRecordType> = (
  state = ConnectionRecord(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.CONNECTION_STATS_SUB_EVENT:
      // Should the errors be unset here?
      return state.set(CORE_CONNECTION_STATS, ConnectionStats(action.payload));
    case ActionTypes.CONNECTION_STATS_SUB_ERROR:
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
