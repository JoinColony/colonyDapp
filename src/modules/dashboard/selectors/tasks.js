/* @flow */

import type { Address } from '~types';
import type { RootStateRecord, TaskDraftId } from '~immutable';

import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASK_METADATA,
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

export const taskFeedItemsSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASK_FEED_ITEMS, draftId]);
