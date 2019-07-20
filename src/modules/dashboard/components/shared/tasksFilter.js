/* @flow */

import { defineMessages } from 'react-intl';

const TASKS_FILTER_MSG = defineMessages({
  filterOptionAll: {
    id: 'dashboard.tasksFilter.filterOptionAll',
    defaultMessage: 'All open tasks',
  },
  filterOptionCreated: {
    id: 'dashboard.tasksFilter.filterOptionCreated',
    defaultMessage: 'Created by you',
  },
  filterOptionAssigned: {
    id: 'dashboard.tasksFilter.filterOptionAssigned',
    defaultMessage: 'Assigned to you',
  },
  filterOptionCompleted: {
    id: 'dashboard.tasksFilter.filterOptionCompleted',
    defaultMessage: 'Completed',
  },
});

export const TASKS_FILTER_OPTIONS = Object.freeze({
  ALL_OPEN: 'ALL_OPEN',
  CREATED: 'CREATED',
  ASSIGNED: 'ASSIGNED',
  COMPLETED: 'COMPLETED',
});

export type TasksFilterOptionType = $Keys<typeof TASKS_FILTER_OPTIONS>;

export const tasksFilterSelectOptions = [
  {
    label: TASKS_FILTER_MSG.filterOptionAll,
    value: TASKS_FILTER_OPTIONS.ALL_OPEN,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionCreated,
    value: TASKS_FILTER_OPTIONS.CREATED,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionAssigned,
    value: TASKS_FILTER_OPTIONS.ASSIGNED,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionCompleted,
    value: TASKS_FILTER_OPTIONS.COMPLETED,
  },
];
