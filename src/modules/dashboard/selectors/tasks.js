/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import type { RootStateRecord, TaskDraftId } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_TASKS } from '../constants';
import { USERS_CURRENT_USER, USERS_NAMESPACE } from '../../users/constants';

/*
 * Input selectors
 */
export const taskRefsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_TASKS], ImmutableMap());

export const userOpenDraftIdsSelector = (state: RootStateRecord) =>
  state.getIn(
    [USERS_NAMESPACE, USERS_CURRENT_USER, ns, 'record', 'open'],
    ImmutableSet(),
  );

export const userClosedDraftIdsSelector = (state: RootStateRecord) =>
  state.getIn(
    [USERS_NAMESPACE, USERS_CURRENT_USER, ns, 'record', 'closed'],
    ImmutableSet(),
  );

export const taskRefSelector = (state: RootStateRecord, draftId: TaskDraftId) =>
  state.getIn([ns, DASHBOARD_TASKS, draftId]);

export const taskRefRecordSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASKS, draftId, 'record']);

export const taskSelector = (state: RootStateRecord, draftId: TaskDraftId) =>
  state.getIn([ns, DASHBOARD_TASKS, draftId, 'record', 'task']);

export const taskFeedItemsSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASKS, draftId, 'record', 'feedItems']);
