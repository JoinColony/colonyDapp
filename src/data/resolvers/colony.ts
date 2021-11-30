import { Resolvers, ApolloClient } from '@apollo/client';
import { AddressZero, HashZero } from 'ethers/constants';
import { bigNumberify, LogDescription } from 'ethers/utils';
import {
  ClientType,
  ColonyVersion,
  Extension,
  TokenClientType,
  extensions,
  getExtensionHash,
  ColonyClientV5,
  ROOT_DOMAIN_ID,
  getHistoricColonyRoles,
  formatColonyRoles,
} from '@colony/colony-js';
import { Contract } from 'ethers';
import { abi as tokenAuthorityABI } from '@colony/colony-js/lib-esm/contracts/deploy/TokenAuthority.json';

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
} from '~data/index';

import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';
import { parseSubgraphEvent } from '~utils/events';
import { Address } from '~types/index';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import { getToken } from './token';
import {
  getColonyFundsClaimedTransfers,
  getPayoutClaimedTransfers,
  getColonyUnclaimedTransfers,
} from './transactions';

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
  let avatar: string | null = null;
  let avatarHash: string | null = null;
  let avatarObject: { image: string | null } | null = { image: null };
  let tokenAddresses: Array<Address> = [];

  const prevIpfsHash = metadataHistory.slice(-1).pop();
  const ipfsHash = metadata || prevIpfsHash?.metadata || null;

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
      const {
        colonyDisplayName = null,
        colonyAvatarHash = null,
        colonyTokens = [],
      } = JSON.parse(ipfsMetadata);
      displayName = colonyDisplayName;
      avatarHash = colonyAvatarHash;
      tokenAddresses = colonyTokens;

      /*
       * Fetch the colony's avatar
       */
      try {
        avatar = await ipfs.getString(colonyAvatarHash);
        avatarObject = JSON.parse(avatar as string);
      } catch (error) {
        log.verbose('Could not fetch colony avatar', avatar);
        log.verbose(
          `Could not parse IPFS avatar for colony:`,
          ensName,
          'with hash:',
          colonyAvatarHash,
        );
      }
    }
  } catch (error) {
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
  let color: string | null = null;
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
      const {
        domainName: metadataDomainName = null,
        domainColor = null,
        domainPurpose = null,
      } = JSON.parse(ipfsMetadata);

      name = metadataDomainName;
      color = domainColor;
      description = domainPurpose;
    }
  } catch (error) {
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
    color: color ? parseInt(color, 10) : Color.LightPink,
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
        domainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
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
      const { tokenClient } = colonyClient;
      const tokenAuthorityAddress = tokenClient.authority();
      const tokenAuthorityContract = new Contract(
        tokenAuthorityAddress,
        tokenAuthorityABI,
        colonyManager.signer,
      );
      const mintSighash = tokenClient.interface.functions.mint.sighash;

      // fetch whether the colony is allowed to mint tokens
      let canMintNativeToken = true;
      try {
        canMintNativeToken = await tokenAuthorityContract.canCall(
          colonyAddress,
          tokenClient.address,
          mintSighash,
        );
      } catch (error) {
        canMintNativeToken = false;
      }
      return canMintNativeToken;
    },
    async canUserMintNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      // fetch whether the user is allowed to mint tokens via the colony
      let canMintNativeToken = true;
      try {
        await colonyClient.estimate.mintTokens(bigNumberify(1));
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
    async canUnlockNativeToken({ colonyAddress }) {
      const colonyClient = (await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      )) as ColonyClientV5;
      try {
        await colonyClient.estimate.unlockToken();
      } catch (error) {
        return false;
      }
      return true;
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
