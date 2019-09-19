import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import { TaskDraftId } from '~immutable/index';

import { RootStateRecord } from '../../state';
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
