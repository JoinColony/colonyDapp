import { Resolvers } from '@apollo/client';
import { AddressZero } from 'ethers/constants';
import {
  ClientType,
  ColonyVersion,
  getExtensionHash,
  getLogs,
  getBlockTime,
  ROOT_DOMAIN_ID,
  Extension,
} from '@colony/colony-js';

import { Context } from '~context/index';
import {
  getMinimalUser,
  SubgraphExtensionVersionDeployedEventsQuery,
  SubgraphExtensionVersionDeployedEventsQueryVariables,
  SubgraphExtensionVersionDeployedEventsDocument,
  SubgraphExtensionEventsQuery,
  SubgraphExtensionEventsQueryVariables,
  SubgraphExtensionEventsDocument,
} from '~data/index';
import extensionData from '~data/staticData/extensionData';
import { parseSubgraphEvent, sortSubgraphEventByIndex } from '~utils/events';
import { SortDirection } from '~types/index';

export const extensionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async networkExtensionVersion(
      _,
      /*
       * @NOTE That the extension parameter in this case is optional
       */
      { extensionId }: { extensionId: Extension },
    ) {
      try {
        const { data: subgraphEvents } = await apolloClient.query<
          SubgraphExtensionVersionDeployedEventsQuery,
          SubgraphExtensionVersionDeployedEventsQueryVariables
        >({
          query: SubgraphExtensionVersionDeployedEventsDocument,
        });

        if (subgraphEvents?.extensionVersionDeployedEvents) {
          const { extensionVersionDeployedEvents } = subgraphEvents;
          const extensionAddedEvents = extensionVersionDeployedEvents
            .map(parseSubgraphEvent)
            .sort(sortSubgraphEventByIndex);

          const extensionsVersions: Array<{
            extensionHash: string;
            version: number;
          }> = [];
          extensionAddedEvents.map(
            ({ values: { extensionId: extensionHash, version } }) => {
              const existingExtensionIndex = extensionsVersions.findIndex(
                ({ extensionHash: existingExtensionHash }) =>
                  existingExtensionHash === extensionHash,
              );
              const currentDeployedExtension = {
                extensionHash,
                version,
              };
              if (existingExtensionIndex >= 0) {
                extensionsVersions[
                  existingExtensionIndex
                ] = currentDeployedExtension;
              }
              extensionsVersions.push(currentDeployedExtension);
              return null;
            },
          );

          if (extensionId) {
            return extensionsVersions.filter(
              ({ extensionHash }) =>
                extensionHash === getExtensionHash(extensionId),
            );
          }
          return extensionsVersions;
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async whitelistedUsers(_, { colonyAddress }) {
      const { provider } = networkClient;
      try {
        const whitelistClient = await colonyManager.getClient(
          ClientType.WhitelistClient,
          colonyAddress,
        );

        /*
         * @TODO Fetch whitelist users from events coming from the subgraph
         * Better yet, refactor this to keep user addresses directly on a subgraph
         * as entities, at which point we could just fetch them directly
         *
         * This will simplify a lot of logic we are using below regarding
         * filtering, sorting, parsing and ensuring they are unique
         */
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
      try {
        const extensionHash = getExtensionHash(extensionId);

        const { data: subgraphEvents } = await apolloClient.query<
          SubgraphExtensionEventsQuery,
          SubgraphExtensionEventsQueryVariables
        >({
          query: SubgraphExtensionEventsDocument,
          variables: {
            colonyAddress: colonyAddress.toLowerCase(),
            extensionAddress: address.toLowerCase(),
            extensionId: extensionHash,
          },
          fetchPolicy: 'network-only',
        });

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

        const [latestInstall] =
          subgraphEvents?.extensionInstalledEvents
            .map(parseSubgraphEvent)
            .filter(({ values: { extensionId: currentExtensionHash } }) => {
              return currentExtensionHash === extensionHash;
            })
            .sort((firstEvent, secondEvent) =>
              sortSubgraphEventByIndex(
                firstEvent,
                secondEvent,
                SortDirection.DESC,
              ),
            ) || [];

        let installedBy = AddressZero;
        let installedAt = 0;

        if (latestInstall) {
          const { hash: transactionHash = '', timestamp } = latestInstall;
          const receipt = await networkClient.provider.getTransactionReceipt(
            transactionHash,
          );
          installedBy = receipt.from || AddressZero;
          installedAt = timestamp || 0;
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
          const initialisedEvents = subgraphEvents?.extensionInitialisedEvents;
          initialized = !!initialisedEvents?.length;
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
      } catch (error) {
        return null;
      }
    },
  },
});
