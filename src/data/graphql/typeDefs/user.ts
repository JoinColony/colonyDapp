import gql from 'graphql-tag';

export default gql`
  extend type Query {
    userBalance(address: String!): String!
  }
`;
