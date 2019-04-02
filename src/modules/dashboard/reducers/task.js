/* @flow */

import { fromJS } from 'immutable';

import type { ReducerType } from '~redux';
import type { DataRecordType, TaskRecordType } from '~immutable';

import { ACTIONS } from '~redux';
import {
  DataRecord,
  TaskPayoutRecord,
  TokenRecord,
  TaskRecord,
} from '~immutable';

const taskReducer: ReducerType<
  DataRecordType<TaskRecordType>,
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
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_SET_DESCRIPTION_SUCCESS:
      // $FlowFixMe https://www.youtube.com/embed/mrtya1apTtM?start=13&end=18&autoplay=1
      return state.setIn(['record', 'description'], action.payload.description);
    case ACTIONS.TASK_SET_DOMAIN_SUCCESS:
      return state.setIn(['record', 'domainId'], action.payload.domainId);
    case ACTIONS.TASK_SET_DUE_DATE_SUCCESS:
      return state.setIn(['record', 'dueDate'], action.payload.dueDate);
    case ACTIONS.TASK_SET_PAYOUT_SUCCESS: {
      const { token, amount } = action.payload;
      return state.updateIn(['record', 'payouts'], payouts =>
        payouts.push(
          TaskPayoutRecord({
            amount: parseInt(amount, 10),
            token: TokenRecord({ address: token }),
          }),
        ),
      );
    }
    case ACTIONS.TASK_SET_SKILL_SUCCESS:
      return state.setIn(['record', 'skillId'], action.payload.skillId);
    case ACTIONS.TASK_SET_TITLE_SUCCESS:
      return state.setIn(['record', 'title'], action.payload.title);
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FETCH_SUCCESS: {
      const { task } = action.payload;
      return DataRecord({
        isFetching: false,
        error: undefined,
        record: TaskRecord(fromJS(task)),
      });
    }
    default:
      return state;
  }
};

export default taskReducer;
