import gql from 'graphql-tag';

export default gql`
  extend type Query {
    faunaTopUsers(limit: Int!): [User]!
    faunaUserByName(username: String!): User
    faunaUserByAddress(address: String!): User
  }
`;
