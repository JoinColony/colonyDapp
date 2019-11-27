/* This file is already part of apollo data. Don't delete */
import gql from 'graphql-tag';
import assignWith from 'lodash/fp/assignWith';

// Merges source object(s) into target object, but values that are truthy
// Move this to a utils file if used somewhere else as well
const assignDefined = assignWith((objValue, srcValue) => srcValue || objValue);

export interface CurrentUser {
  balance: string;
  username?: string;
  walletAddress: string;
}

export const typeDefs = gql`
  type CurrentUser {
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
    setCurrentUserData(input: CurrentUserInput): CurrentUser!
  }
`;

export const CURRENT_USER = gql`
  query CurrentUserData {
    currentUser @client {
      walletAddress
      balance
      username
    }
  }
`;

export const SET_CURRENT_USER = gql`
  mutation SetCurrentUserData($input: CurrentUserInput!) {
    setCurrentUserData(input: $input) @client
  }
`;

export const initialCache = {
  currentUser: {
    __typename: 'CurrentUser',
    walletAddress: '',
    balance: '0',
    username: null,
  },
};

export const resolvers = {
  Mutation: {
    setCurrentUserData: (_root, { data }, { cache }) => {
      const { currentUser } = cache.readQuery({ query: CURRENT_USER });
      const changedData = {
        currentUser: assignDefined({ ...currentUser }, data),
      };
      cache.writeQuery({ query: CURRENT_USER, data: changedData });
      return data.currentUser;
    },
  },
};
