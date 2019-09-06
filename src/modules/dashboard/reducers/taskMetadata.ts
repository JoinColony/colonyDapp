import { Map as ImmutableMap, fromJS } from 'immutable';

import { Address } from '~types/index';
import { ReducerType, ActionTypes } from '~redux/index';
import {
  TaskMetadataMap,
  AllTaskMetadataMap,
  TaskMetadataRecord,
  FetchableData,
} from '~immutable/index';

import { withFetchableDataMap } from '~utils/reducers';

type ColonyTasks = {
  [draftId: string]: {
    commentsStoreAddress: string;
    taskStoreAddress: string;
  };
};

const updateState = (
  state: AllTaskMetadataMap,
  colonyAddress: Address,
  colonyTasks: ColonyTasks,
) => {
  const draftIds = Object.keys(colonyTasks);

  /*
   * Get a map of the existing metadata for this colony.
   */
  const taskMetadata: TaskMetadataMap =
    state.getIn([colonyAddress, 'record']) || ImmutableMap();

  /*
   * Use `withMutations` because it offers better performance when
   * iterating over the entries.
   */
  const record = taskMetadata.withMutations(mutable => {
    /*
     * For each draftId, filter out those that are already loaded (it
     * should not be necessary to change these). With the remaining (new)
     * tasks, set the fetched metadata.
     */
    draftIds
      .filter(draftId => !mutable.has(draftId))
      .forEach(draftId => {
        mutable.set(draftId, TaskMetadataRecord(fromJS(colonyTasks[draftId])));
      });
  });

  return state.set(
    colonyAddress,
    FetchableData({
      error: undefined,
      isFetching: false,
      record,
    }),
  );
};

const taskMetadataReducer: ReducerType<AllTaskMetadataMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_TASK_METADATA_FETCH_SUCCESS:
    case ActionTypes.COLONY_TASK_METADATA_SUB_EVENTS: {
      const { colonyAddress, colonyTasks } = action.payload;
      return updateState(state, colonyAddress, colonyTasks);
    }

    case ActionTypes.TASK_CREATE_SUCCESS: {
      const {
        colonyAddress,
        commentsStoreAddress,
        task: { draftId },
        taskStoreAddress,
      } = action.payload;
      const colonyTasks = {
        [draftId]: { commentsStoreAddress, taskStoreAddress },
      };
      return updateState(state, colonyAddress, colonyTasks).setIn(
        [colonyAddress, 'isFetching'],
        false,
      );
    }

    default:
      return state;
  }
};

export default withFetchableDataMap<AllTaskMetadataMap, TaskMetadataMap>(
  new Set([
    ActionTypes.COLONY_TASK_METADATA_FETCH,
    ActionTypes.COLONY_TASK_METADATA_SUB_START,
  ]),
  ImmutableMap(),
)(taskMetadataReducer);
