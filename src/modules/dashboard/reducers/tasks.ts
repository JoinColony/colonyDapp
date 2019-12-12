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
import { AllCurrentEvents } from '~types/index';

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

    default:
      return state;
  }
};

export default withFetchableDataMap<TasksMap, TaskRecord>(
  new Set([ActionTypes.TASK_FETCH]),
  ImmutableMap() as TasksMap,
)(tasksReducer);
