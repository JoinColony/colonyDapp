import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import { RootStateRecord, TaskDraftId } from '~immutable/index';

import {
  DASHBOARD_ALL_COMMENTS,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

/*
 * Input selectors
 */
export const allCommentsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COMMENTS]);

export const taskCommentsSelector = createSelector(
  allCommentsSelector,
  (state: RootStateRecord, draftId: TaskDraftId) => draftId,
  (allComments, draftId) => allComments.get(draftId, ImmutableMap()),
);
