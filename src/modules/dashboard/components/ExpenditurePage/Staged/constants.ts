import { nanoid } from 'nanoid';

// This is the initial milestone object used to create the initial value in staged payment in the form.
// It is also used as the initial value when you add a new milestone in the staged payment.

export const initalMilestone = {
  name: undefined,
  amount: { value: 0 },
  percent: 0,
  released: false,
  id: nanoid(),
};
