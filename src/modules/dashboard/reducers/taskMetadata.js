/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { Address } from '~types';
import type { ReducerType } from '~redux';
import type {
  TaskMetadataMap,
  AllTaskMetadataMap,
  TaskDraftId,
} from '~immutable';

import { TaskMetadataRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';

type ColonyTasks = {
  [draftId: TaskDraftId]: {|
    commentsStoreAddress: string,
    taskStoreAddress: string,
  |},
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
        mutable.set(draftId, TaskMetadataRecord(colonyTasks[draftId]));
      });
  });

  return state.set(
    colonyAddress,
    DataRecord({
      error: undefined,
      isFetching: false,
      record,
    }),
  );
};

const taskMetadataReducer: ReducerType<
  AllTaskMetadataMap,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH: *,
    COLONY_TASK_METADATA_FETCH: *,
    COLONY_TASK_METADATA_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS: {
      const { colonyAddress, colonyTasks } = action.payload;
      return updateState(state, colonyAddress, colonyTasks);
    }

    case ACTIONS.TASK_CREATE_SUCCESS: {
      const {
        colonyAddress,
        commentsStoreAddress,
        task: { draftId },
        taskStoreAddress,
      } = action.payload;
      const colonyTasks = {
        [draftId]: { commentsStoreAddress, taskStoreAddress },
      };
      return updateState(state, colonyAddress, colonyTasks);
    }

    default:
      return state;
  }
};

export default withDataRecordMap<AllTaskMetadataMap, TaskMetadataMap>(
  ACTIONS.COLONY_TASK_METADATA_FETCH,
  ImmutableMap(),
)(taskMetadataReducer);
