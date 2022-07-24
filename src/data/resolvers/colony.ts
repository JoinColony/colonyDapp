import { Resolvers, ApolloClient } from '@apollo/client';
import { AddressZero, HashZero } from 'ethers/constants';
import { LogDescription } from 'ethers/utils';
import {
  ClientType,
  ColonyVersion,
  Extension,
  TokenClientType,
  extensions,
  getExtensionHash,
  ROOT_DOMAIN_ID,
  getHistoricColonyRoles,
  formatColonyRoles,
  ColonyRole,
} from '@colony/colony-js';
import {
  getColonyAvatarImage,
  getColonyMetadataFromResponse,
  getDomainMetadataFromResponse,
  getEventMetadataVersion,
} from '@colony/colony-event-metadata-parser';

import { Color } from '~core/ColorTag';

import ENS from '~lib/ENS';
import { Context, IpfsWithFallbackSkeleton } from '~context/index';
import {
  Transfer,
  SubgraphDomainsQuery,
  SubgraphDomainsQueryVariables,
  SubgraphDomainsDocument,
  SubgraphSingleDomainQuery,
  SubgraphSingleDomainQueryVariables,
  SubgraphSingleDomainDocument,
  SubgraphColonyQuery,
  SubgraphColonyQueryVariables,
  SubgraphColonyDocument,
  SubgraphRoleEventsQuery,
  SubgraphRoleEventsQueryVariables,
  SubgraphRoleEventsDocument,
  SubgraphLatestSyncedBlockQuery,
  SubgraphLatestSyncedBlockQueryVariables,
  SubgraphLatestSyncedBlockDocument,
  UserQuery,
  UserQueryVariables,
  UserDocument,
  ColonyMembersWithReputationQuery,
  ColonyMembersWithReputationQueryVariables,
  ColonyMembersWithReputationDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
  ColonyFromNameDocument,
  ColonyMembersQuery,
  ColonyMembersQueryVariables,
  ColonyMembersDocument,
  BannedUsersQuery,
  BannedUsersQueryVariables,
  BannedUsersDocument,
} from '~data/index';

import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';
import { parseSubgraphEvent } from '~utils/events';
import { Address } from '~types/index';
import { sortMetadataHistory } from '~utils/colonyActions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getAllUserRolesForDomain } from '~modules/transformers';

import { getToken } from './token';
import {
  getColonyFundsClaimedTransfers,
  getPayoutClaimedTransfers,
  getColonyUnclaimedTransfers,
} from './transactions';
import { getUserReputation } from './user';

export const getLatestSubgraphBlock = async (
  apolloClient: ApolloClient<object>,
): Promise<number> => {
  /*
   * This magic number is hard coded into the subgraph, you cannot filter higher
   * than this block number
   */
  const MAX_UPPER_BLOCK_LIMIT = 2147483647;
  try {
    await apolloClient.query<
      SubgraphLatestSyncedBlockQuery,
      SubgraphLatestSyncedBlockQueryVariables
    >({
      query: SubgraphLatestSyncedBlockDocument,
      variables: {
        blockNumber: MAX_UPPER_BLOCK_LIMIT,
      },
    });
    return MAX_UPPER_BLOCK_LIMIT;
  } catch (error) {
    const [, syncedBlockNumber] = error.message.match(/block\snumber\s(\d*)/);
    return parseInt(syncedBlockNumber, 10);
  }
};

export const getProcessedColony = async (
  subgraphColony,
  colonyAddress: Address,
  ipfs: IpfsWithFallbackSkeleton,
) => {
  const {
    colonyChainId,
    ensName,
    metadata,
    token,
    metadataHistory = [],
    extensions: colonyExtensions = [],
  } = subgraphColony;
  let displayName: string | null = null;
  let avatarObject: { image: string | null } | null = { image: null };
  let avatarHash: string | null = null;
  let tokenAddresses: Array<Address> = [];
  let whitelistedAddresses: Array<Address> = [];
  let whitelistActivated = false;

  const sortedMetadataHistory = sortMetadataHistory(metadataHistory);
  const currentMetadataIndex = sortedMetadataHistory.findIndex(
    ({ metadata: metadataHash }) => metadataHash === metadata,
  );
  const prevMetadata = sortedMetadataHistory[currentMetadataIndex - 1];
  const ipfsHash = metadata || prevMetadata?.metadata || null;

  /*
   * Fetch the colony's metadata
   */
  let ipfsMetadata: string | null = null;
  try {
    ipfsMetadata = await ipfs.getString(ipfsHash);
  } catch (error) {
    log.verbose(
      `Could not fetch IPFS metadata for colony:`,
      ensName,
      'with hash:',
      metadata,
    );
  }

  try {
    if (ipfsMetadata) {
      const metadataVersion = getEventMetadataVersion(ipfsMetadata);
      if (metadataVersion === 1) {
        /*
         * original metadata format
         */
        const {
          colonyDisplayName = null,
          colonyAvatarHash = null,
          colonyTokens = [],
          verifiedAddresses = [],
          isWhitelistActivated = null,
        } = JSON.parse(ipfsMetadata);

        displayName = colonyDisplayName;
        avatarHash = colonyAvatarHash;
        tokenAddresses = colonyTokens;
        whitelistedAddresses = verifiedAddresses;
        if (isWhitelistActivated !== null) {
          whitelistActivated = isWhitelistActivated;
        }
      } else {
        /*
         * new metadata format
         */
        const colonyMetadata = getColonyMetadataFromResponse(ipfsMetadata);
        displayName = colonyMetadata?.colonyDisplayName || '';
        avatarHash = colonyMetadata?.colonyAvatarHash || '';
        tokenAddresses = colonyMetadata?.colonyTokens || [];
        whitelistedAddresses = colonyMetadata?.verifiedAddresses || [];
        if (colonyMetadata?.isWhitelistActivated) {
          whitelistActivated = colonyMetadata.isWhitelistActivated;
        }
      }

      /*
       * Fetch the colony's avatar
       */
      if (avatarHash) {
        let response: string | null = null;
        try {
          response = await ipfs.getString(avatarHash);
          if (response) {
            // checking version to be certain
            const avatarMetadataVersion = getEventMetadataVersion(response);
            avatarObject =
              avatarMetadataVersion === 1
                ? JSON.parse(response) // original metadata format
                : { image: getColonyAvatarImage(response) }; // new metadata format
          }
        } catch (error) {
          /*
           * @NOTE Silent error if avatar hash is null
           */
          if (avatarHash) {
            log.verbose(error.message);
            log.verbose('Could not fetch colony avatar', response);
            log.verbose(
              `Could not parse IPFS avatar for colony:`,
              ensName,
              'with hash:',
              avatarHash,
            );
          }
        }
      }
    }
  } catch (error) {
    log.verbose(error.message);
    log.verbose(
      `Could not parse IPFS metadata for colony:`,
      ensName,
      'with object:',
      ipfsMetadata,
    );
  }

  return {
    __typename: 'ProcessedColony',
    id: parseInt(colonyChainId, 10),
    colonyName: ENS.stripDomainParts('colony', ensName),
    colonyAddress,
    displayName,
    avatarHash,
    avatarURL: avatarObject?.image || null,
    nativeTokenAddress: token?.tokenAddress
      ? createAddress(token.tokenAddress)
      : null,
    tokenAddresses: token?.tokenAddress
      ? [...tokenAddresses, token.tokenAddress].map(createAddress)
      : [],
    extensionAddresses: colonyExtensions.map(({ address }) => address),
    whitelistedAddresses,
    isWhitelistActivated: whitelistActivated,
  };
};

export const getProcessedDomain = async (
  subgraphDomain,
  ipfs: IpfsWithFallbackSkeleton,
) => {
  const {
    metadata,
    metadataHistory = [],
    id,
    domainChainId,
    parent,
    name: domainName,
  } = subgraphDomain;
  let name: string | null = null;
  let color: number | null = null;
  let description: string | null = null;

  const prevIpfsHash = metadataHistory.slice(-1).pop();
  const ipfsHash = metadata || prevIpfsHash?.metadata || null;

  /*
   * Fetch the domains's metadata
   */
  let ipfsMetadata: string | null = null;
  try {
    ipfsMetadata = await ipfs.getString(ipfsHash);
  } catch (error) {
    log.verbose(
      `Could not fetch IPFS metadata for domain:`,
      domainName,
      'with hash:',
      metadata,
    );
  }

  try {
    if (ipfsMetadata) {
      const metadataVersion = getEventMetadataVersion(ipfsMetadata);
      if (metadataVersion === 1) {
        /*
         * original metadata format
         */
        const {
          domainName: metadataDomainName = null,
          domainColor = null,
          domainPurpose = null,
        } = JSON.parse(ipfsMetadata);

        name = metadataDomainName;
        color = domainColor;
        description = domainPurpose;
      } else {
        /*
         * new metadata format
         */
        const domainMetadata = getDomainMetadataFromResponse(ipfsMetadata);
        name = domainMetadata?.domainName || null;
        color = domainMetadata?.domainColor || null;
        description = domainMetadata?.domainPurpose || null;
      }
    }
  } catch (error) {
    log.verbose(error.message);
    log.verbose(
      `Could not parse IPFS metadata for domain:`,
      domainChainId,
      'with object:',
      ipfsMetadata,
    );
  }

  return {
    __typename: 'ProcessedDomain',
    id,
    ethDomainId: parseInt(domainChainId, 10),
    ethParentDomainId: parent?.domainChainId
      ? parseInt(parent.domainChainId, 10)
      : null,
    name: name || domainName,
    color: color || Color.LightPink,
    description,
  };
};

export const colonyResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
  apolloClient,
  ipfsWithFallback,
}: Required<Context>): Resolvers => ({
  Query: {
    async colonyExtension(_, { colonyAddress, extensionId }) {
      const extensionAddress = await networkClient.getExtensionInstallation(
        getExtensionHash(extensionId),
        colonyAddress,
      );
      if (extensionAddress === AddressZero) {
        return null;
      }
      return {
        __typename: 'ColonyExtension',
        id: extensionAddress,
        address: extensionAddress,
        colonyAddress,
        extensionId,
      };
    },
    async colonyAddress(_, { name }) {
      try {
        const address = await ens.getAddress(
          ENS.getFullDomain('colony', name),
          networkClient,
        );
        return address;
      } catch (error) {
        /*
         * @NOTE This makes the server query fail in case of an unexistent/unregistered colony ENS name
         *
         * Otherwise, the ENS resolution will fail, but not this query.
         * This will then not proceed further to the server query and the data
         * will try to load indefinitely w/o an error
         */
        return error;
      }
    },
    async colonyName(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('colony', domain);
    },
    async colonyReputation(_, { address, domainId }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        address,
      );

      const { skillId } = await colonyClient.getDomain(
        domainId || ROOT_DOMAIN_ID,
      );

      const {
        reputationAmount,
      } = await colonyClient.getReputationWithoutProofs(skillId, AddressZero);

      return reputationAmount.toString();
    },
    async colonyMembersWithReputation(
      _,
      {
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
      }: { colonyAddress: Address; domainId: number },
    ) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      const { skillId } = await colonyClient.getDomain(domainId);
      const { addresses } = await colonyClient.getMembersReputation(skillId);
      return addresses || [];
    },
    async contributorsAndWatchers(
      _,
      {
        colonyAddress,
        colonyName,
        domainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
      }: { colonyAddress: Address; colonyName: string; domainId: number },
    ) {
      const { data: colony } = await apolloClient.query<
        ColonyFromNameQuery,
        ColonyFromNameQueryVariables
      >({
        query: ColonyFromNameDocument,
        variables: {
          name: colonyName,
          address: colonyAddress.toLowerCase(),
        },
        fetchPolicy: 'network-only',
      });
      const verifiedAddresses = colony?.processedColony.whitelistedAddresses;

      const domainIdchecked =
        domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID ? ROOT_DOMAIN_ID : domainId;

      const domainRoles = getAllUserRolesForDomain(
        colony?.processedColony,
        domainIdchecked,
      );
      const directDomainRoles = getAllUserRolesForDomain(
        colony?.processedColony,
        domainIdchecked,
        true,
      );

      const inheritedDomainRoles = getAllUserRolesForDomain(
        colony?.processedColony,
        ROOT_DOMAIN_ID,
        true,
      );

      const domainRolesArray = domainRoles
        .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
        .filter(({ roles }) => !!roles.length)
        .map(({ address, roles }) => {
          const directUserRoles = directDomainRoles.find(
            ({ address: userAddress }) => userAddress === address,
          );
          const rootRoles = inheritedDomainRoles.find(
            ({ address: userAddress }) => userAddress === address,
          );
          const allUserRoles = [
            ...new Set([
              ...(directUserRoles?.roles || []),
              ...(rootRoles?.roles || []),
            ]),
          ];
          return {
            userAddress: address,
            roles,
            directRoles: allUserRoles,
          };
        });

      const { data: membersWithReputationData } = await apolloClient.query<
        ColonyMembersWithReputationQuery,
        ColonyMembersWithReputationQueryVariables
      >({
        query: ColonyMembersWithReputationDocument,
        variables: {
          colonyAddress: colonyAddress.toLowerCase(),
          domainId: domainIdchecked,
        },
        fetchPolicy: 'network-only',
      });

      const membersWithReputation = [
        ...(membersWithReputationData?.colonyMembersWithReputation || []),
      ];

      const { data: members } = await apolloClient.query<
        ColonyMembersQuery,
        ColonyMembersQueryVariables
      >({
        query: ColonyMembersDocument,
        variables: {
          colonyAddress,
        },
        fetchPolicy: 'network-only',
      });

      const { data: bannedUsers } = await apolloClient.query<
        BannedUsersQuery,
        BannedUsersQueryVariables
      >({
        query: BannedUsersDocument,
        variables: {
          colonyAddress,
        },
        fetchPolicy: 'network-only',
      });

      const contributors: any[] = [];
      const watchers: any[] = [];

      members?.subscribedUsers.forEach((user) => {
        const {
          profile: { walletAddress },
        } = user;
        const isWhitelisted = verifiedAddresses?.includes(
          createAddress(walletAddress),
        );

        const isUserBanned = bannedUsers?.bannedUsers?.find(
          ({
            id: bannedUserWalletAddress,
            banned,
          }: {
            id: Address;
            banned: boolean;
          }) =>
            banned &&
            createAddress(bannedUserWalletAddress) ===
              createAddress(walletAddress),
        );

        const domainRole = domainRolesArray.find(
          (rolesObject) =>
            createAddress(rolesObject.userAddress) ===
            createAddress(walletAddress),
        );

        const indexInReputationArr = membersWithReputation.indexOf(
          walletAddress.toLowerCase(),
        );
        if (indexInReputationArr > -1) {
          membersWithReputation.splice(indexInReputationArr, 1);
        }

        if (domainRole || indexInReputationArr > -1) {
          contributors.push({
            ...user,
            roles: domainRole ? domainRole.roles : [],
            directRoles: domainRole ? domainRole.directRoles : [],
            banned: !!isUserBanned,
            isWhitelisted,
          });
        } else {
          watchers.push({ ...user, banned: !!isUserBanned, isWhitelisted });
        }
      });

      membersWithReputation.forEach((walletAddress) => {
        const address = createAddress(walletAddress);
        const isWhitelisted = verifiedAddresses?.includes(address);

        const isUserBanned = bannedUsers?.bannedUsers?.find(
          ({
            id: bannedUserWalletAddress,
            banned,
          }: {
            id: Address;
            banned: boolean;
          }) => banned && createAddress(bannedUserWalletAddress) === address,
        );

        contributors.push({
          __typename: 'User',
          id: address,
          profile: {
            __typename: 'UserProfile',
            walletAddress: address,
            avatarHash: null,
            displayName: null,
            username: null,
          },
          roles: [],
          directRoles: [],
          banned: !!isUserBanned,
          isWhitelisted,
        });
      });

      const contributorsWithReputation = await Promise.all(
        contributors.map(async (contributor) => {
          const contributorReputation = await getUserReputation(
            colonyManager,
            contributor.profile.walletAddress,
            colonyAddress,
            domainId,
          );
          return {
            ...contributor,
            userReputation: contributorReputation.toString(),
          };
        }),
      );

      return { contributors: contributorsWithReputation, watchers };
    },
    async colonyDomain(_, { colonyAddress, domainId }) {
      const { data } = await apolloClient.query<
        SubgraphSingleDomainQuery,
        SubgraphSingleDomainQueryVariables
      >({
        query: SubgraphSingleDomainDocument,
        variables: {
          /*
           * Subgraph addresses are not checksummed
           */
          colonyAddress: colonyAddress.toLowerCase(),
          domainId,
        },
        fetchPolicy: 'network-only',
      });
      if (data?.domains) {
        const [singleDomain] = data.domains;
        return singleDomain
          ? getProcessedDomain(singleDomain, ipfsWithFallback)
          : null;
      }
      return null;
    },
    async processedColony(_, { address }) {
      try {
        const { data } = await apolloClient.query<
          SubgraphColonyQuery,
          SubgraphColonyQueryVariables
        >({
          query: SubgraphColonyDocument,
          variables: {
            /*
             * First convert it a string since in cases where the network name
             * cannot be found via ENS it will throw an error
             *
             * Converting this to string basically converts the error object into
             * a string form
             */
            address: address.toString().toLowerCase(),
          },
          fetchPolicy: 'network-only',
        });
        return data?.colony
          ? await getProcessedColony(data.colony, address, ipfsWithFallback)
          : null;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    async historicColonyRoles(_, { colonyAddress, blockNumber }) {
      try {
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );
        return getHistoricColonyRoles(colonyClient, 0, blockNumber);
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async verifiedUsers(_, { verifiedAddresses }) {
      const users = await Promise.all(
        verifiedAddresses.map(async (address) => {
          let username;
          let avatarHash;
          try {
            const { data } = await apolloClient.query<
              UserQuery,
              UserQueryVariables
            >({
              query: UserDocument,
              variables: {
                address,
              },
              fetchPolicy: 'network-only',
            });

            username = data?.user.profile.username;
            avatarHash = data?.user.profile.avatarHash;
          } catch (error) {
            // silent error. Means the user doesn't have a username
            username = '';
            avatarHash = '';
          }

          return {
            id: address,
            profile: {
              avatarHash,
              username,
              walletAddress: address,
            },
          };
        }),
      );

      return users;
    },
  },
  ProcessedColony: {
    async domains({ colonyAddress }) {
      try {
        const { data } = await apolloClient.query<
          SubgraphDomainsQuery,
          SubgraphDomainsQueryVariables
        >({
          query: SubgraphDomainsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
          },
          fetchPolicy: 'network-only',
        });
        if (data?.domains) {
          return Promise.all(
            data.domains.map(async (domain) =>
              getProcessedDomain(domain, ipfsWithFallback),
            ),
          );
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async canColonyMintNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      const { tokenClient, provider } = colonyClient;
      let canMintNativeToken = true;
      /*
       * Fetch whether the colony can mint their token by estimating
       * the gas to do so. If it throws an error, it can't
       */
      try {
        await provider.estimateGas({
          from: colonyAddress,
          to: tokenClient.address,
          /*
           * The mint method (overloaded version) encoded with 1 as the first parameter
           */
          data: tokenClient.interface.functions['mint(uint256)'].encode([1]),
        });
      } catch (error) {
        canMintNativeToken = false;
      }
      return canMintNativeToken;
    },
    async isInRecoveryMode({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      return colonyClient.isInRecoveryMode();
    },
    async isNativeTokenLocked({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      let isNativeTokenLocked: boolean;
      try {
        const locked = await colonyClient.tokenClient.locked();
        isNativeTokenLocked = locked;
      } catch (error) {
        isNativeTokenLocked = false;
      }
      return isNativeTokenLocked;
    },
    async nativeToken({ nativeTokenAddress }, _, { client }) {
      return getToken({ colonyManager, client }, nativeTokenAddress);
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ) {
      const tokens = await Promise.all(
        ['0x0', ...tokenAddresses].map(async (tokenAddress) => {
          try {
            return getToken({ colonyManager, client }, tokenAddress);
          } catch (error) {
            console.error('Could not fetch Colony token:', tokenAddress);
            console.error(error);
            return undefined;
          }
        }),
      );
      return tokens.filter((token) => !!token);
    },
    async canColonyUnlockNativeToken({ colonyAddress }) {
      const { provider } = colonyManager;
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      const { tokenClient } = colonyClient;

      /*
       * Fetch whether the colony can unlock their token by estimating
       * the gas to do so. If it throws an error, it can't
       */
      try {
        await provider.estimateGas({
          from: colonyAddress,
          to: tokenClient.address,
          data: tokenClient.interface.functions.unlock.sighash,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async roles({ colonyAddress }) {
      try {
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );
        const latestBlockNumber = await getLatestSubgraphBlock(apolloClient);

        if (colonyClient.clientVersion === ColonyVersion.GoerliGlider) {
          throw new Error(`Not supported in this version of Colony`);
        }

        const { data } = await apolloClient.query<
          SubgraphRoleEventsQuery,
          SubgraphRoleEventsQueryVariables
        >({
          query: SubgraphRoleEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            toBlock: latestBlockNumber,
          },
          fetchPolicy: 'network-only',
        });

        if (data?.colonyRoleSetEvents && data?.recoveryRoleSetEvents) {
          const {
            colonyRoleSetEvents: colonyRoleSetSubgraphEvents,
            recoveryRoleSetEvents: recoveryRoleSetSubgraphEvents,
          } = data;

          /*
           * Parse events coming from the subgraph
           */
          const colonyRoleEvents = colonyRoleSetSubgraphEvents.map(
            parseSubgraphEvent,
          );
          const recoveryRoleEvents = recoveryRoleSetSubgraphEvents.map(
            parseSubgraphEvent,
          );

          const roles = await formatColonyRoles(
            (colonyRoleEvents as unknown) as LogDescription[],
            (recoveryRoleEvents as unknown) as LogDescription[],
          );

          return roles.map((userRoles) => ({
            ...userRoles,
            domains: userRoles.domains.map((domainRoles) => ({
              ...domainRoles,
              __typename: 'DomainRoles',
            })),
            __typename: 'UserRoles',
          }));
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async transfers({ colonyAddress }): Promise<Transfer[]> {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      // eslint-disable-next-line max-len
      const colonyFundsClaimedTransactions = await getColonyFundsClaimedTransfers(
        apolloClient,
        colonyAddress,
      );
      const payoutClaimedTransactions = await getPayoutClaimedTransfers(
        apolloClient,
        colonyClient,
      );
      return [
        ...colonyFundsClaimedTransactions,
        ...payoutClaimedTransactions,
      ].sort((a, b) => b.date - a.date);
    },
    async unclaimedTransfers({ colonyAddress }): Promise<Transfer[]> {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      // eslint-disable-next-line max-len
      const colonyUnclaimedTransfers = await getColonyUnclaimedTransfers(
        apolloClient,
        colonyClient,
        networkClient,
      );
      // Get ether balance and add a fake transaction if there's any unclaimed
      const colonyEtherBalance = await colonyClient.provider.getBalance(
        colonyAddress,
      );
      // eslint-disable-next-line max-len
      const colonyNonRewardsPotsTotal = await colonyClient.getNonRewardPotsTotal(
        AddressZero,
      );
      const colonyRewardsPotTotal = await colonyClient.getFundingPotBalance(
        0,
        AddressZero,
      );
      const unclaimedEther = colonyEtherBalance
        .sub(colonyNonRewardsPotsTotal)
        .sub(colonyRewardsPotTotal);
      if (unclaimedEther.gt(0)) {
        colonyUnclaimedTransfers.push({
          // @ts-ignore
          __typename: 'Transfer',
          amount: unclaimedEther.toString(),
          colonyAddress,
          date: new Date().getTime(),
          from: AddressZero,
          hash: HashZero,
          incoming: true,
          to: colonyClient.address,
          token: AddressZero,
        });
      }
      return colonyUnclaimedTransfers;
    },
    async version({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      const version = await colonyClient.version();
      return version.toString();
    },
    async isDeploymentFinished({ colonyAddress }) {
      if (!colonyAddress) {
        return null;
      }

      let isDeploymentFinished = true;

      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      /*
       * Check if the token autority is set up
       */
      const { tokenClient } = colonyClient;
      if (tokenClient.tokenClientType === TokenClientType.Colony) {
        const tokenAuthority = await tokenClient.authority();
        if (tokenAuthority === AddressZero) {
          isDeploymentFinished = false;
        }
      }

      return isDeploymentFinished;
    },
    async installedExtensions({ colonyAddress }) {
      const promises = extensions.map((extensionId: Extension) =>
        networkClient.getExtensionInstallation(
          getExtensionHash(extensionId),
          colonyAddress,
        ),
      );
      const extensionAddresses = await Promise.all(promises);
      return extensionAddresses.reduce(
        (
          colonyExtensions: Array<Record<string, any>>,
          address: Address,
          index: number,
        ) => {
          if (address !== AddressZero) {
            return [
              ...colonyExtensions,
              {
                __typename: 'ColonyExtension',
                colonyAddress,
                id: address,
                extensionId: extensions[index],
                address,
              },
            ];
          }
          return colonyExtensions;
        },
        [],
      );
    },
  },
});
