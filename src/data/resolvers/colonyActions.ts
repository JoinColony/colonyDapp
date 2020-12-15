import { ColonyClient, getBlockTime, ClientType } from '@colony/colony-js';
import { bigNumberify, BigNumberish } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { Resolvers } from '@apollo/client';

import { getActionType, getDomainId, getActionValues } from '~utils/events';
import { Context } from '~context/index';
import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  Address,
} from '~types/index';

interface EventValue {
  paymentId: BigNumberish;
  amount: BigNumberish;
  token: Address;
  fromPot: BigNumberish;
  toPot: BigNumberish;
}

export interface ProcessedEvent {
  name: ColonyAndExtensionsEvents;
  values: EventValue;
  createdAt: number;
  emmitedBy: ClientType;
}

export const colonyActionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
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

      /*
       * Try to get the transaction receipt. If the transaction is mined, you'll
       * get a return from this call, otherwise, it's null.
       */
      const transactionReceipt = await provider.getTransactionReceipt(
        transactionHash,
      );

      if (transactionReceipt) {
        const {
          transactionHash: hash,
          status,
          logs,
          blockHash,
          from,
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
                  const { name, values } = potentialParsedLog;
                  return {
                    name,
                    values,
                    createdAt,
                    emmitedBy: type,
                  } as ProcessedEvent;
                }
                return null;
              })
              .filter((potentialLog) => !!potentialLog);
            return parsedLog;
          })
          .reverse() as ProcessedEvent[];

        const values = {
          recipient: AddressZero,
          fromDomain: 1,
          toDomain: 1,
          amount: '0',
          tokenAddress: AddressZero,
        };

        const actionType = getActionType(reverseSortedEvents);

        if (actionType === ColonyActions.MoveFunds) {
          const moveFundsEvent = reverseSortedEvents?.find(
            (event) =>
              event?.name ===
              ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
          );
          const { amount, fromPot, toPot, token } = moveFundsEvent?.values;
          const fromDomain = await getDomainId(
            fromPot,
            colonyClient as ColonyClient,
          );
          const toDomain = await getDomainId(
            toPot,
            colonyClient as ColonyClient,
          );
          values.fromDomain = bigNumberify(fromDomain || '1').toNumber();
          values.toDomain = bigNumberify(toDomain || '1').toNumber();
          values.tokenAddress = token || AddressZero;
          values.amount = bigNumberify(amount || '0').toString();
        }

        const actionValues = await getActionValues(
          reverseSortedEvents,
          colonyClient as ColonyClient,
          actionType,
        );

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
          events: reverseSortedEvents,
          createdAt,
          actionType,
          ...values,
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

      const pendingActionValues = await getActionValues(
        [],
        colonyClient as ColonyClient,
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
        ...pendingActionValues,
      };
    },
  },
});
