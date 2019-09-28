import { List as ImmutableList, Set as ImmutableSet } from 'immutable';
import { createSelector } from 'reselect';

import { Address } from '~types/index';
import {
  FetchableDataRecord,
  TaskDraftId,
  TaskMetadataRecord,
  TaskRecord,
} from '~immutable/index';

import { RootStateRecord } from '../../state';
import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASK_METADATA,
  DASHBOARD_TASK_PAYOUTS,
  DASHBOARD_TASK_REQUESTS,
  DASHBOARD_TASKS,
} from '../constants';

/*
 * Input selectors
 */
export const colonyTaskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): FetchableDataRecord<TaskMetadataRecord> | undefined =>
  state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress]);

export const taskSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
): FetchableDataRecord<TaskRecord> | undefined =>
  state.getIn([ns, DASHBOARD_TASKS, draftId]);

export const tasksByIdsSelector = (
  state: RootStateRecord,
  draftIds: [Address, TaskDraftId][],
) =>
  state
    .getIn([ns, DASHBOARD_TASKS])
    .filter((task, draftId) => draftIds.find(entry => entry[1] === draftId));

export const taskFeedItemsSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASK_FEED_ITEMS, draftId]);

export const taskPayoutsSelector = createSelector(
  taskSelector,
  task =>
    task
      ? task.getIn(['record', DASHBOARD_TASK_PAYOUTS]) || ImmutableList()
      : ImmutableList(),
);

export const taskRequestsSelector = createSelector(
  taskSelector,
  task =>
    task
      ? task.getIn(['record', DASHBOARD_TASK_REQUESTS]) || ImmutableSet()
      : ImmutableSet(),
);
