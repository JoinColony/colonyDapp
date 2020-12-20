import { defineMessages } from 'react-intl';

const FILTER_MSG = defineMessages({
  newest: {
    id: 'dashboard.actionsFilter.newest',
    defaultMessage: 'Newest',
  },
  haveActivity: {
    id: 'dashboard.actionsFilter.haveActivity',
    defaultMessage: 'Activity',
  },
});

export enum ActionFilterOptions {
  NEWEST = 'NEWEST',
  HAVE_ACTIVITY = 'HAVE_ACTIVITY',
}

export type ActionFilterOptionType = ActionFilterOptions[keyof ActionFilterOptions];

export const ActionFilterSelectOptions = [
  {
    label: FILTER_MSG.newest,
    value: ActionFilterOptions.NEWEST,
  },
  {
    label: FILTER_MSG.haveActivity,
    value: ActionFilterOptions.HAVE_ACTIVITY,
  },
];
