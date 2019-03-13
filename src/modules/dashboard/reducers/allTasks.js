/* @flow */

import { Map as ImmutableMap, fromJS } from 'immutable';

import { ACTIONS } from '~redux';

import {
  TaskRecord,
  DataRecord,
  UserRecord,
  TaskFeedItemRecord,
  TaskPayoutRecord,
} from '~immutable';
import { withDataRecordMap } from '~utils/reducers';

import type { AllTasksMap, TaskRecordType } from '~immutable';
import type { ReducerType } from '~redux/types';

const allTasksReducer: ReducerType<
  AllTasksMap,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
    TASK_FETCH_COMMENTS: *,
    TASK_CANCEL_SUCCESS: *,
    // TASK_SET_DATE_SUCCESS: *,
    // TASK_SET_SKILL_SUCCESS: *,
    // TASK_ASSIGN_SUCCESS: *,
    TASK_UPDATE_SUCCESS: *,
  |},
> = (state = new ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, id],
          keyPath,
        },
        payload: { assignee, feedItems = [], payouts = [], ...task },
      } = action;
      const data = DataRecord({
        // TODO in #939
        // $FlowFixMe some of these records aren't constructed properly
        record: TaskRecord({
          ...(assignee && UserRecord(fromJS(assignee))),
          feedItems: feedItems.map(feedItem =>
            TaskFeedItemRecord(fromJS(feedItem)),
          ),
          payouts: payouts.map(payout => TaskPayoutRecord(fromJS(payout))),
          ...task,
        }),
      });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap({ [id]: data }));
    }

    // TODO handle these cases
    // case ACTIONS.TASK_SET_SKILL_SUCCESS:
    // case ACTIONS.TASK_SET_DATE_SUCCESS:
    // case ACTIONS.TASK_ASSIGN_SUCCESS:
    case ACTIONS.TASK_UPDATE_SUCCESS: {
      // Simple update (where the payload can be set on the record directly)
      const {
        meta: { keyPath },
        payload,
      } = action;
      return state.mergeDeepIn([...keyPath, 'record'], payload);
    }

    case ACTIONS.TASK_CANCEL_SUCCESS:
      return state.deleteIn(action.meta.keyPath);

    default:
      return state;
  }
};

export default withDataRecordMap<AllTasksMap, TaskRecordType>(
  ACTIONS.TASK_FETCH,
  new ImmutableMap(),
)(allTasksReducer);
