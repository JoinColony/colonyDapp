import { Address } from './index';

export enum ColonyActions {
  Generic = 'Generic',
  Payment = 'Payment',
  Recovery = 'Recovery',
  MoveFunds = 'MoveFunds',
}

export enum ColonyAndExtensionsEvents {
  Generic = 'Generic',
  ColonyFundsMovedBetweenFundingPots = 'ColonyFundsMovedBetweenFundingPots',
  FundingPotAdded = 'FundingPotAdded',
  PaymentAdded = 'PaymentAdded',
  PayoutClaimed = 'PayoutClaimed',
  OneTxPaymentMade = 'OneTxPaymentMade',
  Transfer = 'Transfer',
}

export interface FormattedAction {
  id: string;
  actionType: ColonyActions;
  initiator: Address;
  recipient: Address;
  amount: string;
  tokenAddress: Address;
  symbol: string;
  decimals: string;
  fromDomain: string;
  toDomain: string;
  transactionHash: string;
  createdAt: Date;
  commentCount: number;
}
