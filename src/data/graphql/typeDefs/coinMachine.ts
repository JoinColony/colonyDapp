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

  extend type Query {
    coinMachineSaleTokens(colonyAddress: String!): SaleTokens!
    coinMachineCurrentPeriodPrice(colonyAddress: String!): String!
    coinMachineCurrentPeriodMaxUserPurchase(
      userAddress: String!
      colonyAddress: String!
    ): String!
    coinMachinePeriodTimeRemaining(colonyAddress: String!): String!
  }
`;
