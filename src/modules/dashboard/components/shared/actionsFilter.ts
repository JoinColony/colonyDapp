import { defineMessages } from 'react-intl';

const FILTER_MSG = defineMessages({
  endingSoonest: {
    id: 'dashboard.actionsFilter.endingSoonest',
    defaultMessage: 'Ending Soonest',
  },
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
  ENDING_SOONEST = 'ENDING_SOONEST',
  NEWEST = 'NEWEST',
  HAVE_ACTIVITY = 'HAVE_ACTIVITY',
}

export type ActionFilterOptionType = ActionFilterOptions[keyof ActionFilterOptions];

export const ActionFilterSelectOptions = [
  {
    label: FILTER_MSG.endingSoonest,
    value: ActionFilterOptions.ENDING_SOONEST,
  },
  {
    label: FILTER_MSG.newest,
    value: ActionFilterOptions.NEWEST,
  },
  {
    label: FILTER_MSG.haveActivity,
    value: ActionFilterOptions.HAVE_ACTIVITY,
  },
];
