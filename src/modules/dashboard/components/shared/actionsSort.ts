import { defineMessages } from 'react-intl';

const FILTER_MSG = defineMessages({
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
    label: FILTER_MSG.newest,
    value: ActionsSortOptions.NEWEST,
  },
  {
    label: FILTER_MSG.oldest,
    value: ActionsSortOptions.OLDEST,
  },
  /* temporarily disabling sorting by activity as this is not available yet */
  // {
  //   label: FILTER_MSG.haveActivity,
  //   value: ActionsSortOptions.HAVE_ACTIVITY,
  // },
];
