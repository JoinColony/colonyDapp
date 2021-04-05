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

        const stakePeriodBigNum = await extensionClient.getStakePeriod();
        const stakePeriod = stakePeriodBigNum.toNumber();

        const submitPeriodBigNum = await extensionClient.getSubmitPeriod();
        const submitPeriod = submitPeriodBigNum.toNumber();

        const revealPeriodBigNum = await extensionClient.getRevealPeriod();
        const revealPeriod = revealPeriodBigNum.toNumber();

        const escalationPerBigNum = await extensionClient.getEscalationPeriod();
        const escalationPeriod = escalationPerBigNum.toNumber();

        return {
          __typename: 'VotingExtensionParams',
          stakePeriod,
          submitPeriod,
          revealPeriod,
          escalationPeriod,
        };
      } catch (error) {
        return error;
      }
    },
  },
});
