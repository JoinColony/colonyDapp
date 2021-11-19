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

  type WhitelistedUser {
    id: String!
    profile: UserProfile!
    approved: Boolean
    agreementSigned: Boolean
  }

  extend type Query {
    whitelistedUsers(colonyAddress: String!): [WhitelistedUser]!
    whitelistAgreement(agreementHash: String!): String!
    whitelistPolicies(colonyAddress: String!): WhitelistPolicy!
    userWhitelistStatus(
      colonyAddress: String!
      userAddress: String!
    ): UserWhitelistStatus!
  }
`;
