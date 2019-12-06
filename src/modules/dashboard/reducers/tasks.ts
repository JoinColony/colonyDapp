import {
  Map as ImmutableMap,
  Set as ImmutableSet,
  List,
  fromJS,
} from 'immutable';

import { ROOT_DOMAIN } from '~constants';
import { ReducerType, ActionTypes } from '~redux/index';
import { TaskRecord, FetchableData, TaskPayout, Task } from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { EventTypes, TaskStates } from '~data/constants';
import { AllCurrentEvents, createAddress } from '~types/index';

import { TasksMap } from '../state/index';

const taskEventReducer = (
  task: TaskRecord,
  event: AllCurrentEvents,
): TaskRecord => {
  switch (event.type) {
    case EventTypes.TASK_CREATED: {
      const {
        payload: { creatorAddress, draftId, domainId },
        meta: { timestamp },
      } = event;
      return task.merge(
        fromJS({
          createdAt: new Date(timestamp),
          creatorAddress,
          currentState: TaskStates.ACTIVE,
          draftId,
          managerAddress: creatorAddress,
          domainId: domainId || ROOT_DOMAIN,
        }),
      );
    }

    case EventTypes.DUE_DATE_SET: {
      const { dueDate } = event.payload;
      return task.set('dueDate', dueDate ? new Date(dueDate) : undefined);
    }

    case EventTypes.DOMAIN_SET: {
      const { domainId } = event.payload;
      return task.set('domainId', domainId);
    }

    case EventTypes.SKILL_SET: {
      const { skillId } = event.payload;
      return task.set('skillId', skillId);
    }

    case EventTypes.TASK_FINALIZED:
      return task.set('currentState', TaskStates.FINALIZED);

    case EventTypes.WORK_INVITE_SENT: {
      const { workerAddress } = event.payload;
      return task.update('invites', invites => invites.add(workerAddress));
    }

    case EventTypes.WORK_REQUEST_CREATED: {
      const { workerAddress } = event.payload;
      return task.update('requests', requests => requests.add(workerAddress));
    }

    case EventTypes.WORKER_ASSIGNED: {
      const { workerAddress } = event.payload;
      return task.set('workerAddress', createAddress(workerAddress));
    }

    case EventTypes.WORKER_UNASSIGNED:
      return task.delete('workerAddress');

    case EventTypes.PAYOUT_SET: {
      const { amount, token } = event.payload;
      return task.set(
        'payouts',
        List([
          TaskPayout(
            fromJS({
              amount,
              token: createAddress(token),
            }),
          ),
        ]),
      );
    }

    case EventTypes.PAYOUT_REMOVED: {
      return task.set('payouts', List());
    }

    default:
      return task;
  }
};

const tasksReducer: ReducerType<TasksMap> = (
  state = ImmutableMap() as TasksMap,
  action,
) => {
  switch (action.type) {
    case ActionTypes.TASK_CREATE_SUCCESS: {
      const {
        draftId,
        task: { colonyAddress, creatorAddress, domainId },
      } = action.payload;
      return state.set(
        draftId,
        FetchableData<TaskRecord>({
          error: undefined,
          isFetching: false,
          record: Task(
            fromJS({ colonyAddress, creatorAddress, draftId, domainId }),
          ),
        }),
      );
    }

    case ActionTypes.TASK_FETCH_SUCCESS: {
      const {
        draftId,
        task: { requests = [], invites = [], payouts = [], ...task },
      } = action.payload;
      return state.set(
        draftId,
        FetchableData<TaskRecord>({
          error: undefined,
          isFetching: false,
          record: Task(
            fromJS({
              ...task,
              requests: ImmutableSet(requests),
              invites: ImmutableSet(invites),
              payouts: List(
                payouts.map(({ amount, token }) =>
                  TaskPayout({ amount, token }),
                ),
              ),
            }),
          ),
        }),
      );
    }

    case ActionTypes.TASK_SUB_EVENTS: {
      const { colonyAddress, draftId, events } = action.payload;

      const record: TaskRecord = events.reduce(
        taskEventReducer,
        Task(fromJS({ colonyAddress, draftId })),
      );
      return state.set(draftId, FetchableData({ record }));
    }

    default:
      return state;
  }
};

export default withFetchableDataMap<TasksMap, TaskRecord>(
  new Set([ActionTypes.TASK_FETCH, ActionTypes.TASK_SUB_START]),
  ImmutableMap() as TasksMap,
)(tasksReducer);
