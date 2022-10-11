import { nanoid } from 'nanoid';

export const paidToDate = [
  {
    amount: 25000,
    token: '0x0000000000000000000000000000000000000000',
    id: nanoid(),
  },
  {
    amount: 25000,
    token: '0xC9Ef69D2bE69C3BC9D7444982597fAF1A90697d1',
    id: nanoid(),
  },
];

export const availableToClaim = [
  {
    amount: 25000,
    token: '0x0000000000000000000000000000000000000000',
    id: nanoid(),
  },
  {
    amount: 25000,
    token: '0xC9Ef69D2bE69C3BC9D7444982597fAF1A90697d1',
    id: nanoid(),
  },
];

export const insufficientFundsEventTrigger = 'funds-trigger';
