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
  filterOptionDiscarded: {
    id: 'dashboard.tasksFilter.filterOptionDiscarded',
    defaultMessage: 'Discarded',
  },
});

export enum TasksFilterOptions {
  ALL_OPEN = 'ALL_OPEN',
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  DISCARDED = 'DISCARDED',
}

export type TasksFilterOptionType = TasksFilterOptions[keyof TasksFilterOptions];

export const tasksFilterSelectOptions = [
  {
    label: TASKS_FILTER_MSG.filterOptionAll,
    value: TasksFilterOptions.ALL_OPEN,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionCreated,
    value: TasksFilterOptions.CREATED,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionAssigned,
    value: TasksFilterOptions.ASSIGNED,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionCompleted,
    value: TasksFilterOptions.COMPLETED,
  },
  {
    label: TASKS_FILTER_MSG.filterOptionDiscarded,
    value: TasksFilterOptions.DISCARDED,
  },
];
