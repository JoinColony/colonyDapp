import { nanoid } from 'nanoid';

import { TimePeriod } from '../types';

// This is the initial rate object used to create the initial value in staged multiple payment in the form.
// It is also used as the initial value when you add a new rate in the multiple payment.

export const newRate = {
  amount: undefined,
  token: undefined,
  time: TimePeriod.Month,
  limit: undefined,
  id: nanoid(),
};
