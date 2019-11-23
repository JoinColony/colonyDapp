import gql from 'graphql-tag';

export const USER = gql`
  query User($address: String!) {
    user(address: $address) {
      profile {
        username
        walletAddress
        displayName
        bio
        location
        website
        avatarHash
      }
    }
  }
`;
