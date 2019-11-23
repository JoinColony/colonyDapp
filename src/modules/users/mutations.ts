import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $address: String!) {
    createUser(username: $username, address: $address) {
      profile {
        username
        walletAddress
      }
    }
  }
`;
