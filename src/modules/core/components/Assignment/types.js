/* @flow */
import BN from 'bn.js';

export type UserData = {
  id: string,
  fullName?: string,
  username?: string,
};
export type Payout = {
  symbol: string,
  amount: number | string | BN,
};
export type Task = {
  id: number,
  title: string,
  reputation: number,
  payouts: Array<Payout>,
  creator: string,
  assignee: {
    walletAddress: string,
    username: string,
  },
};
