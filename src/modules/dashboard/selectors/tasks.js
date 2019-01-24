/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootState } from '~types';

import ns from '../namespace';

export const allTasksSelector = (state: RootState) => state[ns].allTasks;

export const colonyTasksSelector = createSelector(
  allTasksSelector,
  (state, props) => props.colonyENSName,
  (allTasks, colonyENSName) => allTasks.get(colonyENSName, new ImmutableMap()),
);

export const singleTaskSelector = createSelector(
  colonyTasksSelector,
  (state, props) => props.id,
  (tasks, id) => tasks.get(id),
);
