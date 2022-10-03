import { nanoid } from 'nanoid';

export const initalMilestone = {
  name: undefined,
  amount: { value: 0 },
  percent: 0,
  released: false,
  id: nanoid(),
};
