import gql from 'graphql-tag';

export const COLONY_SUBSCRIBED_USERS = gql`
  query ColonySubscribedUsers($colonyAddress: String!) {
    colony(address: $colonyAddress) {
      id
      subscribedUsers {
        id
        profile {
          avatarHash
          displayName
          username
          walletAddress
        }
      }
    }
  }
`;
