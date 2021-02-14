import { ClientType } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { ColonyAndExtensionsEvents } from '~types/index';
import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';

export const eventsResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Event: {
    async processedValues({
      args,
      name,
      associatedColony: { colonyAddress = AddressZero },
    }) {
      try {
        const initialValues = JSON.parse(args);
        if (
          name.includes(
            ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
          )
        ) {
          const colonyClient = await colonyManager.getClient(
            ClientType.ColonyClient,
            createAddress(colonyAddress),
          );
          const fromDomain = await colonyClient.getDomainFromFundingPot(
            initialValues.fromPot,
          );
          const toDomain = await colonyClient.getDomainFromFundingPot(
            initialValues.toPot,
          );
          initialValues.fromDomain = fromDomain.toString();
          initialValues.toDomain = toDomain.toString();
        }
        return initialValues;
      } catch (error) {
        log.verbose(`Could not get the event args from: ${args}`);
        log.verbose(error);
        return {};
      }
    },
  },
});
