import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { nanoid } from 'nanoid';
import { defineMessages } from 'react-intl';

import { newRate } from './FundingSource/constants';
import { TimePeriod } from './types';

const MSG = defineMessages({
  month: {
    id: 'dashboard.ExpenditurePage.Streaming.constants.month',
    defaultMessage: 'month',
  },
  week: {
    id: 'dashboard.ExpenditurePage.Streaming.constants.week',
    defaultMessage: 'week',
  },
  day: {
    id: 'dashboard.ExpenditurePage.Streaming.constants.day',
    defaultMessage: 'day',
  },
  hour: {
    id: 'dashboard.ExpenditurePage.Streaming.constants.hour',
    defaultMessage: 'hour',
  },
});

export const newFundingSource = {
  team: String(ROOT_DOMAIN_ID),
  rates: [newRate],
  isExpanded: true,
  id: nanoid(),
};

export const timeOptions = [
  {
    label: MSG.month,
    value: TimePeriod.Month,
  },
  {
    label: MSG.week,
    value: TimePeriod.Week,
  },
  {
    label: MSG.day,
    value: TimePeriod.Day,
  },
  {
    label: MSG.hour,
    value: TimePeriod.Hour,
  },
];
