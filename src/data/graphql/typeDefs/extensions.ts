import gql from 'graphql-tag';

export default gql`
  type ColonyExtension {
    address: String!
    id: String!
    extensionId: String!
    details(colonyAddress: String!): ColonyExtensionDetails!
  }

  type ColonyExtensionVersion {
    extensionHash: String!
    version: Int!
  }

  type ColonyExtensionDetails {
    deprecated: Boolean!
    initialized: Boolean!
    installedBy: String!
    installedAt: Int!
    missingPermissions: [Int!]!
    version: Int!
  }

  type SubgraphColonyExtension {
    id: String!
    hash: String!
  }

  extend type Query {
    colonyExtension(
      colonyAddress: String!
      extensionId: String!
    ): ColonyExtension
    networkExtensionVersion(extensionId: String): [ColonyExtensionVersion]!
  }
`;
