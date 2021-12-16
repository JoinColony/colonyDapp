import gql from 'graphql-tag';

export default gql`
  type TokenUnwrapping {
    wrappedToken: UserToken!
    unwrappedToken: UserToken!
  }

  extend type Query {
    unwrapTokenForMetacolony(userAddress: String!): TokenUnwrapping!
  }
`;
