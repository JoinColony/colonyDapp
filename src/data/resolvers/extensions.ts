import { Resolvers } from '@apollo/client';

import { ClientType } from '@colony/colony-js';

import { Context } from '~context/index';

export const extensionsResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async votingExtensionParams(_, { colonyAddress }) {
      try {
        const extensionClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );

        const stakePeriodBigNumber = await extensionClient.getStakePeriod();

        const stakePeriod = stakePeriodBigNumber.toNumber();

        return {
          __typename: 'VotingExtensionParams',
          stakePeriod,
        };
      } catch (error) {
        return error;
      }
    },
  },
});
