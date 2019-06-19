/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskRecordType, TasksMap } from '~immutable';

import {
  DataRecord,
  TASK_STATE,
  TaskPayoutRecord,
  TaskRecord,
  TokenRecord,
} from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';
import { TASK_EVENT_TYPES } from '~data/constants';
import { createAddress } from '~types';

const {
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

const taskEventReducer = (task: TaskRecordType, event: *) => {
  switch (event.type) {
    case TASK_CREATED: {
      const {
        payload: { creatorAddress, draftId },
        meta: { timestamp },
      } = event;
      return task.merge({
        createdAt: new Date(timestamp),
        creatorAddress,
        draftId,
        managerAddress: creatorAddress,
      });
    }

    case DUE_DATE_SET: {
      const { dueDate } = event.payload;
      return task.set('dueDate', new Date(dueDate));
    }

    case DOMAIN_SET: {
      const { domainId } = event.payload;
      return task.set('domainId', domainId);
    }

    case SKILL_SET: {
      const { skillId } = event.payload;
      return task.set('skillId', skillId);
    }

    case TASK_TITLE_SET: {
      const { title } = event.payload;
      return task.set('title', title);
    }

    case TASK_DESCRIPTION_SET: {
      const { description } = event.payload;
      return task.set('description', description);
    }

    case TASK_FINALIZED:
      return task.set('currentState', TASK_STATE.FINALIZED);

    case TASK_CANCELLED:
      return task.set('currentState', TASK_STATE.CANCELLED);

    case WORK_INVITE_SENT: {
      const { workerAddress } = event.payload;
      return task.update('invites', invites => invites.add(workerAddress));
    }

    case WORK_REQUEST_CREATED: {
      const { workerAddress } = event.payload;
      return task.update('requests', requests => requests.add(workerAddress));
    }

    case WORKER_ASSIGNED: {
      const { workerAddress } = event.payload;
      return task.set('workerAddress', createAddress(workerAddress));
    }

    case WORKER_UNASSIGNED:
      return task.delete('workerAddress');

    case PAYOUT_SET: {
      const { amount, token } = event.payload;
      return task.update('payouts', payouts =>
        payouts.push(
          TaskPayoutRecord({
            amount,
            token: TokenRecord({ address: createAddress(token) }),
          }),
        ),
      );
    }

    default:
      return task;
  }
};

const tasksReducer: ReducerType<
  TasksMap,
  {|
    TASK_CANCEL_SUCCESS: *,
    TASK_COMMENT_ADD_SUCCESS: *,
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
    TASK_FINALIZE_SUCCESS: *,
    TASK_SEND_WORK_INVITE_SUCCESS: *,
    TASK_SEND_WORK_REQUEST_SUCCESS: *,
    TASK_SET_DESCRIPTION_SUCCESS: *,
    TASK_SET_DOMAIN_SUCCESS: *,
    TASK_SET_DUE_DATE_SUCCESS: *,
    TASK_SET_PAYOUT_SUCCESS: *,
    TASK_SET_SKILL_SUCCESS: *,
    TASK_SET_TITLE_SUCCESS: *,
    TASK_SUB_EVENTS: *,
    TASK_WORKER_ASSIGN_SUCCESS: *,
    TASK_WORKER_UNASSIGN_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_CREATE_SUCCESS: {
      const {
        draftId,
        task: { colonyAddress, creatorAddress },
      } = action.payload;
      return state.set(
        draftId,
        DataRecord({
          error: undefined,
          isFetching: false,
          record: TaskRecord({ colonyAddress, creatorAddress, draftId }),
        }),
      );
    }

    case ACTIONS.TASK_FETCH_SUCCESS: {
      const {
        draftId,
        task: { requests = [], invites = [], payouts = [], ...task },
      } = action.payload;
      return state.set(
        draftId,
        DataRecord({
          error: undefined,
          isFetching: false,
          record: TaskRecord({
            ...task,
            requests: ImmutableSet(requests),
            invites: ImmutableSet(invites),
            payouts: List(
              payouts.map(({ amount, token }) =>
                TaskPayoutRecord({ amount, token: TokenRecord(token) }),
              ),
            ),
          }),
        }),
      );
    }

    case ACTIONS.TASK_SUB_EVENTS: {
      const { draftId, events } = action.payload;
      return state.setIn(
        [draftId, 'record'],
        // $FlowFixMe this is fine...
        events.reduce(taskEventReducer, TaskRecord()),
      );
    }

    case ACTIONS.TASK_CANCEL_SUCCESS:
    case ACTIONS.TASK_FINALIZE_SUCCESS:
    case ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS:
    case ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS:
    case ACTIONS.TASK_SET_DESCRIPTION_SUCCESS:
    case ACTIONS.TASK_SET_DOMAIN_SUCCESS:
    case ACTIONS.TASK_SET_DUE_DATE_SUCCESS:
    case ACTIONS.TASK_SET_PAYOUT_SUCCESS:
    case ACTIONS.TASK_SET_SKILL_SUCCESS:
    case ACTIONS.TASK_SET_TITLE_SUCCESS:
    case ACTIONS.TASK_WORKER_ASSIGN_SUCCESS:
    case ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS: {
      const { draftId, event } = action.payload;
      const path = [draftId, 'record'];
      return state.getIn(path)
        ? state.updateIn(path, task => task && taskEventReducer(task, event))
        : state;
    }

    default:
      return state;
  }
};

export default withDataRecordMap<TasksMap, TaskRecordType>(
  new Set([ACTIONS.TASK_FETCH, ACTIONS.TASK_SUB_START]),
  ImmutableMap(),
)(tasksReducer);
