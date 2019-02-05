/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_ALL_TASKS, DASHBOARD_NAMESPACE as ns } from '../constants';

export const allTasksSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TASKS], ImmutableMap());

export const colonyTasksSelector = createSelector(
  allTasksSelector,
  (state, props) => props.colonyENSName,
  (allTasks, colonyENSName) => allTasks.get(colonyENSName, ImmutableMap()),
);

export const singleTaskSelector = createSelector(
  colonyTasksSelector,
  (state, props) => props.id,
  (tasks, id) => tasks.get(id),
);
