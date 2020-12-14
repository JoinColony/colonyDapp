export enum ColonyActions {
  Generic = 'Generic',
  Payment = 'Payment',
  Recovery = 'Recovery',
  MoveFunds = 'Move Funds',
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
