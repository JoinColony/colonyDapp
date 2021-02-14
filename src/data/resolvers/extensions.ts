import { Resolvers } from '@apollo/client';
import { getExtensionHash } from '@colony/colony-js';

import { Context } from '~context/index';

export const extensionsResolvers = ({
  colonyManager: { networkClient, colonyClients },
}: Required<Context>): Resolvers => ({
  Query: {
    async oneTxPaymentExtensionAddress() {
      if (colonyClients?.entries()?.next()?.value) {
        const [colonyAddress] = colonyClients.entries().next().value;
        const address = await networkClient.getExtensionInstallation(
          getExtensionHash('OneTxPayment'),
          colonyAddress,
        );

        return address;
      }
      return null;
    },
  },
});
