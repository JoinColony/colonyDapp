/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { createSelector } from 'reselect';

import type { Address } from '~types';
import type { RootStateRecord, TaskDraftId } from '~immutable';

import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASK_METADATA,
  DASHBOARD_TASK_REQUESTS,
  DASHBOARD_TASKS,
} from '../constants';

/*
 * Input selectors
 */
export const colonyTaskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress]);

export const taskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  draftId: TaskDraftId,
) =>
  state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress, 'record', draftId]);

export const taskSelector = (state: RootStateRecord, draftId: TaskDraftId) =>
  state.getIn([ns, DASHBOARD_TASKS, draftId]);

export const tasksByIdsSelector = (
  state: RootStateRecord,
  draftIds: TaskDraftId[],
) =>
  state
    .getIn([ns, DASHBOARD_TASKS], ImmutableMap())
    .filter((task, draftId) => draftIds.includes(draftId));

export const taskFeedItemsSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASK_FEED_ITEMS, draftId]);

export const taskRequestsSelector = createSelector(
  taskSelector,
  task =>
    task
      ? task.getIn(['record', DASHBOARD_TASK_REQUESTS], ImmutableSet())
      : ImmutableSet(),
);
