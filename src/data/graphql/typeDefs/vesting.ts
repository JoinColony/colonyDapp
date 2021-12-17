import gql from 'graphql-tag';

export default gql`
  type TokenUnwrapping {
    wrappedToken: UserToken!
    unwrappedToken: UserToken!
  }

  type Grants {
    totalAllocation: String!
    claimable: String!
    claimed: String!
  }

  type GrantsAllocation {
    grantsToken: UserToken!
    grants: Grants!
  }

  extend type Query {
    unwrapTokenForMetacolony(userAddress: String!): TokenUnwrapping!
    claimTokensFromMetacolony(userAddress: String!): GrantsAllocation!
  }
`;
