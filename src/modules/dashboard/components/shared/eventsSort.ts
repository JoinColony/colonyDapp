import { defineMessages } from 'react-intl';

const SORT_MSG = defineMessages({
  oldest: {
    id: 'dashboard.eventsSort.oldest',
    defaultMessage: 'Oldest',
  },
  newest: {
    id: 'dashboard.eventsSort.newest',
    defaultMessage: 'Newest',
  },
});

export enum EventsSortOptions {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export type EventsSortOptionType = EventsSortOptions[keyof EventsSortOptions];

export const EventsSortSelectOptions = [
  {
    label: SORT_MSG.newest,
    value: EventsSortOptions.NEWEST,
  },
  {
    label: SORT_MSG.oldest,
    value: EventsSortOptions.OLDEST,
  },
];
