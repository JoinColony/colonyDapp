import gql from 'graphql-tag';

export const COLONY_SUBSCRIBED_USERS = gql`
  query ColonySubscribedUsers($colonyAddress: String!) {
    colony(colonyAddress: $colonyAddress) {
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
