import { defineMessages } from 'react-intl';

const FILTER_MSG = defineMessages({
  oldest: {
    id: 'dashboard.eventsFilter.oldest',
    defaultMessage: 'Oldest',
  },
  newest: {
    id: 'dashboard.eventsFilter.newest',
    defaultMessage: 'Newest',
  },
});

export enum EventFilterOptions {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export type EventFilterOptionType = EventFilterOptions[keyof EventFilterOptions];

export const EventFilterSelectOptions = [
  {
    label: FILTER_MSG.newest,
    value: EventFilterOptions.NEWEST,
  },
  {
    label: FILTER_MSG.oldest,
    value: EventFilterOptions.OLDEST,
  },
];
