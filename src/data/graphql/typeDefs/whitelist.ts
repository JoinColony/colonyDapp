import gql from 'graphql-tag';

export default gql`
  type WhitelistPolicy {
    useApprovals: Boolean!
    agreementHash: String!
    policyType: Int!
  }

  type UserWhitelistStatus {
    userIsApproved: Boolean!
    userIsWhitelisted: Boolean!
    userSignedAgreement: Boolean!
  }

  extend type Query {
    whitelistedUsers(colonyAddress: String!): [User!]!
    whitelistAgreement(agreementHash: String!): String!
    whitelistPolicies(colonyAddress: String!): WhitelistPolicy!
    userWhitelistStatus(
      colonyAddress: String!
      userAddress: String!
    ): UserWhitelistStatus!
  }
`;
