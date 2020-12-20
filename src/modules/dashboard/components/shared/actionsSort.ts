import { defineMessages } from 'react-intl';

const FILTER_MSG = defineMessages({
  newest: {
    id: 'dashboard.ActionsSort.newest',
    defaultMessage: 'Newest',
  },
  haveActivity: {
    id: 'dashboard.ActionsSort.haveActivity',
    defaultMessage: 'Activity',
  },
});

export enum ActionsSortOptions {
  NEWEST = 'NEWEST',
  HAVE_ACTIVITY = 'HAVE_ACTIVITY',
}

export type ActionSortOptionType = ActionsSortOptions[keyof ActionsSortOptions];

export const ActionsSortSelectOptions = [
  {
    label: FILTER_MSG.newest,
    value: ActionsSortOptions.NEWEST,
  },
  {
    label: FILTER_MSG.haveActivity,
    value: ActionsSortOptions.HAVE_ACTIVITY,
  },
];
