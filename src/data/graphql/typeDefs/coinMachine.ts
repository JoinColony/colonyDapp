import gql from 'graphql-tag';

export default gql`
  type SaleToken {
    address: String!
    decimals: Int!
    symbol: String!
    name: String!
  }

  type SaleTokens {
    sellableToken: SaleToken!
    purchaseToken: SaleToken!
  }

  type SalePeriod {
    periodLength: String!
    timeRemaining: String!
  }
  type CurrentPeriodTokens {
    maxPerPeriodTokens: String!
    activeSoldTokens: String!
    targetPerPeriodTokens: String!
  }

  type BoughtTokens {
    numTokens: String!
    totalCost: String!
  }

  type TrannsactionAmount {
    transactionAmount: String!
    transactionSucceed: Boolean!
  }

  type PreviousPeriods {
    saleEndedAt: Int!
    tokensBought: String!
    totalPrice: String!
  }

  extend type Query {
    coinMachineSaleTokens(colonyAddress: String!): SaleTokens!
    coinMachineCurrentPeriodPrice(colonyAddress: String!): String!
    coinMachineBoughtTokens(
      colonyAddress: String!
      transactionHash: String!
    ): BoughtTokens!
    coinMachineTransactionAmount(
      colonyAddress: String!
      transactionHash: String!
    ): TrannsactionAmount!
    coinMachineCurrentPeriodMaxUserPurchase(
      userAddress: String!
      colonyAddress: String!
    ): String!
    coinMachineSalePeriod(colonyAddress: String!): SalePeriod!
    currentPeriodTokens(colonyAddress: String!): CurrentPeriodTokens!
    coinMachineTokenBalance(colonyAddress: String!): String!
    coinMachineTokenSales(colonyAddress: String!): [PreviousPeriods!]!
  }
`;
