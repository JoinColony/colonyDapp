import gql from 'graphql-tag';

export default gql`
  type UsersAndRecoveryApprovals {
    id: String!
    profile: UserProfile!
    approvedRecoveryExit: Boolean!
  }

  extend type Query {
    recoveryEventsForSession(
      blockNumber: Int!
      colonyAddress: String!
    ): [ParsedEvent!]!
    recoverySystemMessagesForSession(
      blockNumber: Int!
      colonyAddress: String!
    ): [SystemMessage!]!
    recoveryRolesUsers(colonyAddress: String!, endBlockNumber: Int): [User!]!
    getRecoveryStorageSlot(
      colonyAddress: String!
      storageSlot: String!
    ): String!
    recoveryRolesAndApprovalsForSession(
      blockNumber: Int!
      colonyAddress: String!
    ): [UsersAndRecoveryApprovals!]!
    getRecoveryRequiredApprovals(
      blockNumber: Int!
      colonyAddress: String!
    ): Int!
    recoveryAllEnteredEvents(
      colonyAddress: String!
      currentBlock: Int!
    ): [ParsedEvent!]!
    legacyNumberOfRecoveryRoles(colonyAddress: String!): Int!
  }
`;
