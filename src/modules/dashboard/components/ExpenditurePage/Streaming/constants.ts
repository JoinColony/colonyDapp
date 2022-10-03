import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { nanoid } from 'nanoid';

export const newFundingSource = {
  team: String(ROOT_DOMAIN_ID),
  rate: {
    amount: undefined,
    token: undefined,
    time: 'month',
  },
  isExpanded: true,
  id: nanoid(),
};
