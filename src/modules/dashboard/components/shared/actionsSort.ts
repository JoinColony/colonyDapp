import { defineMessages } from 'react-intl';

const SORT_MSG = defineMessages({
  newest: {
    id: 'dashboard.ActionsSort.newest',
    defaultMessage: 'Newest',
  },
  oldest: {
    id: 'dashboard.ActionsSort.oldest',
    defaultMessage: 'Oldest',
  },
  haveActivity: {
    id: 'dashboard.ActionsSort.haveActivity',
    defaultMessage: 'Activity',
  },
});

export enum ActionsSortOptions {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  HAVE_ACTIVITY = 'HAVE_ACTIVITY',
}

export type ActionSortOptionType = ActionsSortOptions[keyof ActionsSortOptions];

export const ActionsSortSelectOptions = [
  {
    label: SORT_MSG.newest,
    value: ActionsSortOptions.NEWEST,
  },
  {
    label: SORT_MSG.oldest,
    value: ActionsSortOptions.OLDEST,
  },
  /* temporarily disabling sorting by activity as this is not available yet */
  // {
  //   label: SORT_MSG.haveActivity,
  //   value: ActionsSortOptions.HAVE_ACTIVITY,
  // },
];
