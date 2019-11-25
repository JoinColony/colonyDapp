import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser($address: String!, $username: String!) {
    createUser(address: $address, username: $username) {
      id
      profile {
        username
        walletAddress
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($address: String!, $profile: UserProfileInput!) {
    editUser(address: $address, profile: $profile) {
      id
      profile {
        username
        walletAddress
        avatarHash
        bio
        displayName
        location
        website
      }
    }
  }
`;
