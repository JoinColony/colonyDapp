import { defineMessages } from 'react-intl';

const SORT_MSG = defineMessages({
  newest: {
    id: 'dashboard.Sort.newest',
    defaultMessage: 'Newest',
  },
  oldest: {
    id: 'dashboard.Sort.oldest',
    defaultMessage: 'Oldest',
  },
  haveActivity: {
    id: 'dashboard.Sort.haveActivity',
    defaultMessage: 'Activity',
  },
});

export enum SortOptions {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  HAVE_ACTIVITY = 'HAVE_ACTIVITY',
}

export type SortOptionType = SortOptions[keyof SortOptions];

export const SortSelectOptions = [
  {
    label: SORT_MSG.newest,
    value: SortOptions.NEWEST,
  },
  {
    label: SORT_MSG.oldest,
    value: SortOptions.OLDEST,
  },
  /* temporarily disabling sorting by activity as this is not available yet */
  // {
  //   label: SORT_MSG.haveActivity,
  //   value: SortOptions.HAVE_ACTIVITY,
  // },
];
