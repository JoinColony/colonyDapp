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

  type CurrentSalePeriod {
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

  type SalePeriod {
    saleEndedAt: String!
    tokensBought: String!
    tokensAvailable: String!
    price: String!
  }

  input ByColonyFilter {
    colonyAddress: String!
  }

  extend type Query {
    coinMachineSaleTokens(colonyAddress: String!): SaleTokens!
    coinMachineCurrentPeriodPrice(colonyAddress: String!): String!
    coinMachineBoughtTokens(colonyAddress: String!): BoughtTokens!
    coinMachineTransactionAmount(
      colonyAddress: String!
      transactionHash: String!
    ): TrannsactionAmount!
    coinMachineCurrentPeriodMaxUserPurchase(
      userAddress: String!
      colonyAddress: String!
    ): String!
    coinMachineCurrentSalePeriod(colonyAddress: String!): CurrentSalePeriod!
    currentPeriodTokens(colonyAddress: String!): CurrentPeriodTokens!
    coinMachineTokenBalance(colonyAddress: String!): String!
    coinMachinePeriods(
      skip: Int!
      first: Int!
      where: ByColonyFilter
      orderBy: String!
      orderDirection: String!
    ): [SalePeriod!]!
    coinMachineSalePeriods(colonyAddress: String!, limit: Int!): SalePeriod!
    events(
      skip: Int
      first: Int
      where: EventsFilter
      orderDirection: String
    ): [SubgraphEvent!]!
  }
`;
