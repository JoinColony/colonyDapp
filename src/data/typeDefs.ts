import gql from 'graphql-tag';

export default gql`
  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
  }

  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
  }

  extend type Query {
    loggedInUser: LoggedInUser!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
  }
`;
