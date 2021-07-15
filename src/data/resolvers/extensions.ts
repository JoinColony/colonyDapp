import { Resolvers } from '@apollo/client';
import { AddressZero } from 'ethers/constants';
import {
  ClientType,
  ColonyVersion,
  getExtensionHash,
  getEvents,
  getLogs,
  getBlockTime,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';

import { Context } from '~context/index';
import { getMinimalUser } from '~data/index';

import extensionData from '~data/staticData/extensionData';

export const extensionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async networkExtensionVersion(_, { extensionId }) {
      /*
       * Prettier is being stupid again
       */
      // eslint-disable-next-line max-len
      const extensionAddedToNetworkFilter = networkClient.filters.ExtensionAddedToNetwork(
        getExtensionHash(extensionId),
        null,
      );
      const extensionAddedEvents = await getEvents(
        networkClient,
        extensionAddedToNetworkFilter,
      );
      if (extensionAddedEvents.length) {
        const latestEvent = extensionAddedEvents
          .sort(
            (
              { values: { version: firstVersion } },
              { values: { version: secondVersion } },
            ) => firstVersion.toNumber() - secondVersion.toNumber(),
          )
          .pop();
        const version = latestEvent?.values?.version;
        return version.toNumber();
      }
      return 0;
    },
    async whitelistedUsers(_, { colonyAddress }) {
      const { provider } = networkClient;
      try {
        const whitelistClient = await colonyManager.getClient(
          ClientType.WhitelistClient,
          colonyAddress,
        );

        const userApprovedFilter = whitelistClient.filters.UserApproved(
          null,
          null,
        );

        const userApprovedLogs = await getLogs(
          whitelistClient,
          userApprovedFilter,
        );

        const userApprovedEvents = await Promise.all(
          userApprovedLogs.map(async (log) => {
            const parsedLog = whitelistClient.interface.parseLog(log);
            const { blockHash } = log;
            return {
              ...parsedLog,
              createdAt: blockHash
                ? await getBlockTime(provider, blockHash)
                : 0,
            };
          }),
        );
        const sortedUserApprovedEvents = userApprovedEvents.sort(
          (firstEvent, secondEvent) =>
            secondEvent.createdAt - firstEvent.createdAt,
        );
        const uniqeAddresses = [
          ...new Set(userApprovedEvents.map((event) => event.values._user)), // eslint-disable-line no-underscore-dangle
        ];

        return uniqeAddresses.reduce((users, userAddress) => {
          const userLastEvent = sortedUserApprovedEvents.find(
            (event) => event.values._user === userAddress, // eslint-disable-line no-underscore-dangle
          );
          // eslint-disable-next-line no-underscore-dangle
          if (userLastEvent.values._status) {
            return [...users, getMinimalUser(userLastEvent.values._user)]; // eslint-disable-line no-underscore-dangle
          }
          return users;
        }, []);
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  ColonyExtension: {
    async details({ address, extensionId }, { colonyAddress }) {
      const extension = extensionData[extensionId];
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      if (colonyClient.clientVersion === ColonyVersion.GoerliGlider) {
        throw new Error('Colony version too old');
      }

      const { neededColonyPermissions } = extension;

      const missingPermissions = await Promise.resolve(
        neededColonyPermissions.reduce(async (roles, role) => {
          const hasRole = await colonyClient.hasUserRole(
            address,
            ROOT_DOMAIN_ID,
            role,
          );
          if (!hasRole) return [...(await roles), role];
          return roles;
        }, Promise.resolve([])),
      );

      const installFilter = networkClient.filters.ExtensionInstalled(
        getExtensionHash(extensionId),
        colonyAddress,
        null,
      );
      const installLogs = await getLogs(networkClient, installFilter);
      let installedBy = AddressZero;
      let installedAt = 0;

      if (
        installLogs[0] &&
        installLogs[0].transactionHash &&
        installLogs[0].blockHash
      ) {
        const { blockHash, transactionHash } = installLogs[0];
        const receipt = await networkClient.provider.getTransactionReceipt(
          transactionHash,
        );
        installedBy = receipt.from || AddressZero;
        const time = await getBlockTime(networkClient.provider, blockHash);
        installedAt = time || 0;
      }

      const extensionClient = await colonyClient.getExtensionClient(
        extensionId,
      );

      const deprecated = await extensionClient.getDeprecated();

      const version = await extensionClient.version();

      // If no initializationParams are present it does not need initialization
      // and will set to be true by default
      let initialized = !extension.initializationParams;
      if (!initialized) {
        // Otherwise we look for the presence of an initialization event
        // eslint-disable-next-line max-len
        const initializedFilter = extensionClient.filters.ExtensionInitialised();
        const initializedEvents = await getEvents(
          extensionClient,
          initializedFilter,
        );
        initialized = !!initializedEvents.length;
      }

      return {
        __typename: 'ColonyExtensionDetails',
        deprecated,
        missingPermissions,
        initialized,
        installedBy,
        installedAt,
        version: version.toNumber(),
      };
    },
  },
});
