/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import {
  DASHBOARD_ALL_COMMENTS,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

/*
 * Tasks selectors
 */
export const allCommentsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COMMENTS], ImmutableMap());

export const tasksCommentsSelector = createSelector(
  allCommentsSelector,
  (state, props) => props.id,
  (allComments, id) => allComments.get(id, ImmutableMap()),
);
