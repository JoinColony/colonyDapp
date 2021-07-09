/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClientType, ColonyClientV6 } from '@colony/colony-js';
import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';

export const whitelistResolvers = ({
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async whitelistAgreement(_, { colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        // const whitelistClient = await colonyManager.getClient(
        //   ClientType.WhitelistClient,
        //   colonyAddress,
        // );

        return {
          whitelistAgreement: '',
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
