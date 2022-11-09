import {
  ColonyClient,
  getBlockTime,
  ClientType,
  ColonyVersion,
  ColonyRole,
  ExtensionClient,
} from '@colony/colony-js';
import { BigNumberish } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { Resolvers } from '@apollo/client';

import {
  getActionType,
  getActionValues,
  getAnnotationFromSubgraph,
  getMotionActionType,
} from '~utils/events';
import { Context } from '~context/index';
import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  Address,
  ColonyExtendedMotions,
} from '~types/index';
import { ActionsPageFeedType } from '~dashboard/ActionsPageFeed';
import { MotionVote } from '~utils/colonyMotions';

export interface EventValue {
  agent: Address;
  domainId: BigNumberish;
  paymentId: BigNumberish;
  amount: BigNumberish;
  motionId: BigNumberish;
  token: Address;
  fromPot: BigNumberish;
  toPot: BigNumberish;
  who: Address;
  oldVersion: string;
  newVersion: string;
  metadata: string;
  user: Address;
  creator: Address;
  role: ColonyRole;
  setTo: boolean;
  vote: MotionVote;
  skillId: BigNumberish;
}

export interface ProcessedEvent {
  type: ActionsPageFeedType;
  name: ColonyAndExtensionsEvents;
  values: EventValue;
  createdAt: number;
  blockNumber: number;
  emmitedBy: ClientType;
  address: Address;
  transactionHash: string;
  index?: string;
}

export const colonyActionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async colonyAction(_, { transactionHash, colonyAddress }) {
      const { provider } = networkClient;

      /*
       * Get all clients from all extensions enabled in the cololony
       */
      const clientsInstancesArray = (
        await Promise.all(
          Object.values(ClientType).map(async (clientType) => {
            try {
              return await colonyManager.getClient(clientType, colonyAddress);
            } catch (error) {
              return undefined;
            }
          }),
        )
      ).filter((clientType) => !!clientType);

      /*
       * Get the colony client specifically
       */
      const colonyClient = clientsInstancesArray.find(
        (client) => client?.clientType === ClientType.ColonyClient,
      );

      const votingClient = clientsInstancesArray.find(
        (client) => client?.clientType === ClientType.VotingReputationClient,
      );

      const oneTxPaymentClient = clientsInstancesArray.find(
        (client) => client?.clientType === ClientType.OneTxPaymentClient,
      );

      /*
       * Try to get the transaction receipt. If the transaction is mined, you'll
       * get a return from this call, otherwise, it's null.
       */
      const transactionReceipt = await provider.getTransactionReceipt(
        transactionHash,
      );

      if (transactionReceipt) {
        const {
          transactionHash: hash = '',
          status,
          logs,
          blockHash,
          blockNumber,
          from = '',
        } = transactionReceipt;

        /*
         * Get the block time in ms
         *
         * we fallback to 0, which is 1/1/1970 :)
         * If we don't find a time for the current tx (which shouldn't happen actually)
         */
        const createdAt = blockHash
          ? await getBlockTime(provider, blockHash)
          : 0;

        /*
         * @NOTE Parse all logs with all clients to generate all the possible events
         * This is the second iteration of this implementation.
         *
         * It is less perfomant than just iterating over the clientsInstancesArray and
         * then just passing it the logs array to process, but this way allows us to
         * preseve the position of each event as it was originally emmited by the contracts.
         *
         * This way we can use that index position to inferr the action type from them
         */
        const reverseSortedEvents = logs
          ?.map((log) => {
            const [parsedLog] = clientsInstancesArray
              .map((clientType) => {
                const type = clientType?.clientType;
                const potentialParsedLog = clientType?.interface.parseLog(log);
                if (potentialParsedLog) {
                  const {
                    address,
                    transactionHash: currentLogTransactionHash,
                  } = log;
                  const { name, values } = potentialParsedLog;
                  return {
                    type: ActionsPageFeedType.NetworkEvent,
                    name,
                    values,
                    createdAt,
                    emmitedBy: type,
                    address,
                    transactionHash: currentLogTransactionHash,
                  } as ProcessedEvent;
                }
                return null;
              })
              .filter((potentialLog) => !!potentialLog);
            return parsedLog;
          })
          .reverse()
          /*
           * Events list needs to be filtered one more time since in the case
           * of events created by the network resolver they will show up undefined
           * as well as we cannot parse them with any client we can instantiate
           */
          .filter((log) => !!log) as ProcessedEvent[];

        let actionType;
        const motionCreatedEvent = reverseSortedEvents.find(
          ({ name }) => name === ColonyAndExtensionsEvents.MotionCreated,
        );

        if (motionCreatedEvent) {
          actionType = await getMotionActionType(
            votingClient as ExtensionClient,
            oneTxPaymentClient as ExtensionClient,
            colonyClient as ColonyClient,
            motionCreatedEvent.values.motionId,
          );
        } else {
          actionType = getActionType(reverseSortedEvents);
        }
        const actionValues = await getActionValues(
          reverseSortedEvents,
          colonyClient as ColonyClient,
          votingClient as ExtensionClient,
          oneTxPaymentClient as ExtensionClient,
          apolloClient,
          actionType,
        );

        let events = reverseSortedEvents;
        /*
         * If the address is the null address, that means that most likely this
         * transaction was generated by "other" means (most likely a transfer between accounts)
         */
        if (actionValues.address === AddressZero) {
          throw new Error('Transaction is not a Colony Action');
        }
        /*
         * If the address is not equal to the current colony, or of it's installed extensions, it means that it's still
         * an action, but it was created by a different colony
         */
        if (
          !clientsInstancesArray.find(
            /*
             * Yes there is an address prop on an instantiated client
             * But apparently TS is deciding to be stupid here and I really
             * don't have the patience to deal with it's bs
             */
            // @ts-ignore
            ({ address }) => address === actionValues.address,
          )
        ) {
          actionType = ColonyActions.WrongColony;
          events = [];
        }

        const clientVersion = await colonyClient?.version();
        let annotation;
        if (
          clientVersion.toNumber() >= ColonyVersion.LightweightSpaceship &&
          actionType !== ColonyExtendedMotions.SafeTransactionInitiatedMotion
        ) {
          annotation = await getAnnotationFromSubgraph(
            actionValues?.actionInitiator || actionValues?.address || from,
            hash,
            apolloClient,
          );
        }

        return {
          hash,
          /*
           * @TODO this needs to be replaced with a value that is going to come
           * from the `agent` value prop in events, which is not currently implemented
           *
           * So for now we are just using the `from` address. This should not make
           * it into production, as relying on it is error-prone.
           */
          actionInitiator: from,
          status,
          events,
          createdAt,
          actionType,
          annotationHash: annotation ? annotation?.values?.metadata : null,
          annotationMessage: '',
          colonyDisplayName: null,
          colonyAvatarHash: null,
          colonyTokens: [],
          domainName: null,
          domainPurpose: null,
          domainColor: null,
          blockNumber,
          motionState: null,
          motionDomain: null,
          rootHash: null,
          isWhitelistActivated: false,
          verifiedAddresses: [],
          colonySafes: [],
          safeData: null,
          safeTransactions: [],
          transactionsTitle: '',
          ...actionValues,
        };
      }

      /*
       * If we don't have a receipt, just get the transaction
       * This means the transaction is currently mining, so we mark it as "pending"
       *
       * We won't have logs until the transaction is mined, so that means we need to
       * add the transaction as "Unknown"
       *
       * Maybe we should inferr something from whether or not the `from` or `to`
       * addressses have a user profile created. But that might be error prone.
       */
      const { hash, from } = await provider.getTransaction(transactionHash);

      /*
       * This basically fetches the fallback values
       */
      const pendingActionValues = await getActionValues(
        [],
        colonyClient as ColonyClient,
        votingClient as ExtensionClient,
        oneTxPaymentClient as ExtensionClient,
        apolloClient,
        ColonyActions.Generic,
      );

      return {
        hash,
        actionInitiator: from,
        status: 2,
        events: null,
        /*
         * Since this is a pending transaction, and we can't get the blockHash anyway,
         * we just set it to "now" as that is mostly true anyway (unless the tx takes
         * a very long time to mine) -- but this is a limitation of operating w/o a
         * server
         */
        createdAt: Date.now(),
        actionType: ColonyActions.Generic,
        annotationMetadata: null,
        colonyDisplayName: null,
        colonyAvatarHash: null,
        colonyTokens: [],
        colonySafes: [],
        blockNumber: null,
        motionState: null,
        motionDomain: null,
        rootHash: null,
        isWhitelistActivated: false,
        verifiedAddresses: [],
        safeData: null,
        safeTransactions: [],
        transactionsTitle: '',
        annotationMessage: '',
        ...pendingActionValues,
      };
    },
  },
});
