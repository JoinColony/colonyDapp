import { defineMessages } from 'react-intl';

const SORT_MSG = defineMessages({
  soonest: {
    id: 'dashboard.Sort.soonest',
    defaultMessage: 'Ending soonest',
  },
  latest: {
    id: 'dashboard.Sort.latest',
    defaultMessage: 'Ending latest',
  },
});

export enum SortOptions {
  ENDING_SOONEST = 'ENDING_SOONEST',
  ENDING_LATEST = 'ENDING_LATEST',
}

export const SortSelectOptions = [
  {
    label: SORT_MSG.soonest,
    value: SortOptions.ENDING_SOONEST,
  },
  {
    label: SORT_MSG.latest,
    value: SortOptions.ENDING_LATEST,
  },
];
