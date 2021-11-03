import { Resolvers, ApolloClient } from '@apollo/client';

import {
  ClientType,
  ROOT_DOMAIN_ID,
  getBlockTime,
  getLogs,
} from '@colony/colony-js';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { AddressZero, HashZero } from 'ethers/constants';
import Decimal from 'decimal.js';

import { Context } from '~context/index';
import ENS from '~lib/ENS';
import ColonyManager from '~lib/ColonyManager';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import {
  Transfer,
  SubgraphColoniesQuery,
  SubgraphColoniesQueryVariables,
  SubgraphColoniesDocument,
  UserLock,
  UserToken,
} from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import {
  SubgraphUserMotionTokenEventsQuery,
  SubgraphUserMotionTokenEventsQueryVariables,
  SubgraphUserMotionTokenEventsDocument,
} from '~data/generated';
import { parseSubgraphEvent } from '~utils/events';

import { getToken } from './token';
import { getProcessedColony } from './colony';

const getUserReputation = async (
  colonyManager: ColonyManager,
  address: Address,
  colonyAddress: Address,
  domainId: number,
  rootHash?: string,
): Promise<BigNumber> => {
  const colonyClient = await colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const { skillId } = await colonyClient.getDomain(
    /*
     * If we have the "All Teams" domain selected, fetch reputation values from "Root"
     */
    domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID ? ROOT_DOMAIN_ID : domainId,
  );
  const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
    skillId,
    address,
    rootHash,
  );
  return reputationAmount;
};

const getUserStakedBalance = async (
  apolloClient: ApolloClient<object>,
  walletAddress: Address,
  colonyAddress: Address,
  extensionAddress: Address,
): Promise<BigNumber> => {
  /**
   * @NOTE If there will be more staking events
   * on reputation voting extension we need to remember to filter them out
   * in here for correct value of staked tokens.
   */
  const { data } = await apolloClient.query<
    SubgraphUserMotionTokenEventsQuery,
    SubgraphUserMotionTokenEventsQueryVariables
  >({
    query: SubgraphUserMotionTokenEventsDocument,
    fetchPolicy: 'network-only',
    variables: {
      walletAddress: walletAddress.toLowerCase(),
      colonyAddress: colonyAddress.toLowerCase(),
      extensionAddress: extensionAddress.toLowerCase(),
    },
  });

  const motionStakedEvents = (data?.motionStakedEvents || []).map(
    parseSubgraphEvent,
  );
  const motionRewardClaimedEvents = (data?.motionRewardClaimedEvents || []).map(
    parseSubgraphEvent,
  );

  const groupedMotionStakeEvents = motionStakedEvents.reduce((acc, event) => {
    const { vote, motionId } = event.values;
    const key = `${motionId.toString()}-${vote.toString()}`;
    if (!acc[key]) {
      acc[key] = [event];
    } else {
      acc[key].push(event);
    }
    return acc;
  }, {});

  const filteredKeys = Object.keys(groupedMotionStakeEvents).filter((key) => {
    const { motionId, vote } = groupedMotionStakeEvents[key][0].values;
    const mappedMotionRewardClaimedEvent = motionRewardClaimedEvents.find(
      (claimedEvent) =>
        claimedEvent.values.motionId.toString() === motionId.toString() &&
        claimedEvent.values.vote.toString() === vote.toString(),
    );

    return !mappedMotionRewardClaimedEvent;
  });

  const notClaimedEvents = filteredKeys.reduce((acc, key) => {
    return [...acc, ...groupedMotionStakeEvents[key]];
  }, []);

  const totalStaked = notClaimedEvents.reduce((acc, event) => {
    return acc.add(event.values.amount);
  }, bigNumberify(0));

  return totalStaked;
};

const getUserLock = async (
  apolloClient: ApolloClient<object>,
  colonyManager: ColonyManager,
  walletAddress: Address,
  tokenAddress: Address,
  colonyAddress: Address,
): Promise<UserLock> => {
  const tokenLockingClient = await colonyManager.getClient(
    ClientType.TokenLockingClient,
    colonyAddress,
  );
  let votingReputationClient;

  try {
    votingReputationClient = await colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );
  } catch (error) {
    /*
     * We don't care to catch the error as the value depending on the extension
     * will jsut default to 0
     */
    // silent error
  }

  const userLock = await tokenLockingClient.getUserLock(
    tokenAddress,
    walletAddress,
  );
  const totalObligation = await tokenLockingClient.getTotalObligation(
    walletAddress,
    tokenAddress,
  );

  const stakedTokens =
    votingReputationClient === undefined
      ? 0
      : await getUserStakedBalance(
          apolloClient,
          walletAddress,
          colonyAddress,
          votingReputationClient.address,
        );

  const nativeToken = (await getToken(
    { colonyManager, client: apolloClient },
    tokenAddress,
    walletAddress,
  )) as UserToken;
  return {
    balance: userLock.balance.toString(),
    nativeToken: nativeToken || null,
    totalObligation: totalObligation.add(stakedTokens).toString(),
    activeTokens: userLock.balance.sub(totalObligation).toString(),
    pendingBalance: userLock.pendingBalance.toString(),
  };
};

export const userResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
  apolloClient,
  ipfsWithFallback,
}: Required<Context>): Resolvers => ({
  Query: {
    async userAddress(_, { name }): Promise<Address> {
      const address = await ens.getAddress(
        ENS.getFullDomain('user', name),
        networkClient,
      );
      return address;
    },
    async userReputation(
      _,
      {
        address,
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
        rootHash,
      }: {
        address: Address;
        colonyAddress: Address;
        domainId?: number;
        rootHash?: string;
      },
    ): Promise<string> {
      const reputation = await getUserReputation(
        colonyManager,
        address,
        colonyAddress,
        domainId,
        rootHash,
      );
      return reputation.toString();
    },
    async userReputationForTopDomains(_, { address, colonyAddress }) {
      try {
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );

        // eslint-disable-next-line max-len
        const userReputationForAllDomains: {
          reputationAmount?: BigNumber;
          domainId: number;
          skillId: number;
        }[] = await colonyClient.getReputationAcrossDomains(address);

        // Extract only the relevant data and
        // transform the user reputation amount on each domain to percentage
        const formattedUserReputations = userReputationForAllDomains.map(
          async (userReputation) => {
            const totalColonyReputation = await getUserReputation(
              colonyManager,
              AddressZero,
              colonyAddress,
              userReputation.domainId,
            );
            const reputationPercentage = calculatePercentageReputation(
              userReputation.reputationAmount?.toString(),
              totalColonyReputation.toString(),
            );
            return {
              reputationPercentage,
              domainId: userReputation.domainId,
            };
          },
        );
        const formattedUserReputationsResult = await Promise.all(
          formattedUserReputations,
        );

        // Filter out the reputation percentages that are 0
        const filteredUserReputations = formattedUserReputationsResult.filter(
          (userReputation) =>
            userReputation.reputationPercentage &&
            userReputation.reputationPercentage !== ZeroValue.Zero,
        );

        // Sort out the percentages from highest to lowest
        // and extract up to 3 reputations from the array
        const topUserReputations = [...filteredUserReputations]
          .sort((reputationA, reputationB) => {
            const safeReputationA = new Decimal(
              reputationA.reputationPercentage || 0,
            );
            const safeReputationB = new Decimal(
              reputationB.reputationPercentage || 0,
            );

            if (safeReputationB.eq(safeReputationA)) {
              return 0;
            }
            if (
              safeReputationB.lt(safeReputationA) &&
              reputationB.domainId !== ROOT_DOMAIN_ID
            ) {
              return -1;
            }
            return 1;
          })
          .slice(0, 3);

        return topUserReputations;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async username(_, { address }): Promise<string> {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('user', domain);
    },
  },
  User: {
    async reputation(
      user,
      {
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
      }: { colonyAddress: Address; domainId: number },
    ): Promise<string> {
      const {
        profile: { walletAddress },
      } = user;
      const reputation = await getUserReputation(
        colonyManager,
        walletAddress,
        colonyAddress,
        domainId,
      );
      return reputation.toString();
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      { walletAddress },
      { client },
    ) {
      return Promise.all(
        [AddressZero, ...tokenAddresses].map(async (tokenAddress) =>
          getToken({ colonyManager, client }, tokenAddress, walletAddress),
        ),
      );
    },
    async userLock(
      _,
      { tokenAddress, walletAddress, colonyAddress },
      { client },
    ): Promise<UserLock> {
      const userLock = await getUserLock(
        client,
        colonyManager,
        walletAddress,
        tokenAddress,
        colonyAddress,
      );
      return userLock;
    },
    async tokenTransfers({
      walletAddress,
      colonyAddresses,
    }): Promise<Transfer[]> {
      const metaColonyClient = await colonyManager.getMetaColonyClient();
      const { tokenClient } = metaColonyClient;

      const transferFromFilter = tokenClient.filters.Transfer(
        walletAddress,
        null,
        null,
      );
      const transferToFilter = tokenClient.filters.Transfer(
        null,
        walletAddress,
        null,
      );
      const transferFromLogs = await getLogs(tokenClient, transferFromFilter);
      const transferToLogs = await getLogs(tokenClient, transferToFilter);

      const logs = [...transferFromLogs, ...transferToLogs].sort((a, b) => {
        if (a.blockNumber && b.blockNumber) {
          return a.blockNumber - b.blockNumber;
        }
        return 0;
      });

      return Promise.all(
        logs.map(async (log) => {
          const {
            values: { src, dst, wad },
          } = tokenClient.interface.parseLog(log);
          const from = createAddress(src);
          const to = createAddress(dst);
          const date = log.blockHash
            ? await getBlockTime(tokenClient.provider, log.blockHash)
            : 0;
          const colonyAddress = colonyAddresses.find(
            (address) => address === from || address === to,
          );

          return {
            __typename: 'Transaction',
            amount: wad.toString(),
            colonyAddress,
            date,
            from: createAddress(src),
            // I have no idea why this would ever by empty but we rely on this being there
            hash: log.transactionHash || HashZero,
            incoming: to === walletAddress,
            to,
            token: createAddress(log.address),
          };
        }),
      );
    },
    async processedColonies({ colonyAddresses = [] }) {
      try {
        const { data } = await apolloClient.query<
          SubgraphColoniesQuery,
          SubgraphColoniesQueryVariables
        >({
          query: SubgraphColoniesDocument,
          fetchPolicy: 'network-only',
          variables: {
            colonyAddresses: colonyAddresses.map((address) =>
              address.toLowerCase(),
            ),
          },
        });
        if (data?.colonies) {
          return Promise.all(
            data.colonies.map(async (colony) =>
              getProcessedColony(
                colony,
                createAddress(colony.id),
                ipfsWithFallback,
              ),
            ),
          );
        }
        return null;
      } catch (error) {
        console.info(error);
        return null;
      }
    },
  },
});
