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
  
  type BoughtTokens {
    numTokens: String!
    totalCost: String!
  }

  extend type Query {
    coinMachineSaleTokens(colonyAddress: String!): SaleTokens!
    coinMachineCurrentPeriodPrice(colonyAddress: String!): String!
    coinMachineBoughtTokens(colonyAddress: String!, walletAddress: String!): BoughtTokens!
    coinMachineCurrentPeriodMaxUserPurchase(
      userAddress: String!
      colonyAddress: String!
    ): String!
    coinMachineSalePeriod(colonyAddress: String!): SalePeriod!
  }
`;
