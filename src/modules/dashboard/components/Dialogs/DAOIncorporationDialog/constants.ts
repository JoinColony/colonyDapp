import { nanoid } from 'nanoid';

export enum Step {
  Why = 'why',
  How = 'how',
  Cost = 'cost',
}

export enum IncorporationPayment {
  Cost = 'cost',
  Reneval = 'renewal',
}

// this is a mock data
export const prices = [
  {
    id: nanoid(),
    type: IncorporationPayment.Cost,
    token: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 6,
      iconHash: '',
      id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    amount: '5300000000',
  },
  {
    id: nanoid(),
    type: IncorporationPayment.Reneval,
    token: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 6,
      iconHash: '',
      id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    amount: '3800000000',
  },
];
