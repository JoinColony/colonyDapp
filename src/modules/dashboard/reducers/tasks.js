/* @flow */

import { fromJS, Map as ImmutableMap } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskRecordType, TasksMap } from '~immutable';

import {
  DataRecord,
  TaskPayoutRecord,
  TaskRecord,
  TokenRecord,
} from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';

const tasksReducer: ReducerType<
  TasksMap,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
    TASK_SET_DESCRIPTION_SUCCESS: *,
    TASK_SET_DOMAIN_SUCCESS: *,
    TASK_SET_DUE_DATE_SUCCESS: *,
    TASK_SET_SKILL_SUCCESS: *,
    TASK_SET_PAYOUT_SUCCESS: *,
    TASK_SET_TITLE_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_FETCH_SUCCESS:
    case ACTIONS.TASK_CREATE_SUCCESS: {
      const { draftId, task } = action.payload;
      return state.set(
        draftId,
        DataRecord({
          isFetching: false,
          error: undefined,
          record: TaskRecord(fromJS(task)),
        }),
      );
    }

    case ACTIONS.TASK_SET_DESCRIPTION_SUCCESS: {
      const { draftId, description } = action.payload;
      return state.setIn([draftId, 'record', 'description'], description);
    }

    case ACTIONS.TASK_SET_DOMAIN_SUCCESS: {
      const { draftId, domainId } = action.payload;
      return state.setIn([draftId, 'record', 'domainId'], domainId);
    }

    case ACTIONS.TASK_SET_DUE_DATE_SUCCESS: {
      const { draftId, dueDate } = action.payload;
      return state.setIn([draftId, 'record', 'dueDate'], dueDate);
    }

    case ACTIONS.TASK_SET_PAYOUT_SUCCESS: {
      const { draftId, token, amount } = action.payload;
      // $FlowFixMe TODO in #943 ensure this is correct
      return state.updateIn([draftId, 'record', 'payouts'], payouts =>
        payouts.push(
          TaskPayoutRecord({
            amount: parseInt(amount, 10),
            token: TokenRecord({ address: token }),
          }),
        ),
      );
    }

    case ACTIONS.TASK_SET_SKILL_SUCCESS: {
      const { draftId, skillId } = action.payload;
      return state.setIn([draftId, 'record', 'skillId'], skillId);
    }

    case ACTIONS.TASK_SET_TITLE_SUCCESS: {
      const { draftId, title } = action.payload;
      return state.setIn([draftId, 'record', 'title'], title);
    }

    default:
      return state;
  }
};

export default withDataRecordMap<TasksMap, TaskRecordType>(
  ACTIONS.TASK_FETCH,
  ImmutableMap(),
)(tasksReducer);
