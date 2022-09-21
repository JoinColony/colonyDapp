import { nanoid } from 'nanoid';
import { TimePeriod } from '../types';

export const newRate = {
  amount: undefined,
  token: undefined,
  time: TimePeriod.Month,
  limit: undefined,
  id: nanoid(),
};
