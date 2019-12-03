import gql from 'graphql-tag';

export const COLONY_SUBSCRIBED_USERS = gql`
  query ColonySubscribedUsers($colonyAddress: String!) {
    colonySubscribedUsers(colonyAddress: $colonyAddress) {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
  }
`;
