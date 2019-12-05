import gql from 'graphql-tag';

export default gql`
  type CurrentUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
  }

  input CurrentUserInput {
    balance: String
    username: String
    walletAddress: String
  }

  extend type Query {
    currentUser: CurrentUser!
  }

  extend type Mutation {
    setCurrentUser(input: CurrentUserInput): CurrentUser!
  }
`;
