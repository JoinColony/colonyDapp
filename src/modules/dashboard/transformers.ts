import { AddressZero, HashZero } from 'ethers/constants';

import {
  TransactionsMessagesCount,
  SubscriptionSubgraphOneTxSubscription,
  SubscriptionSubgraphEventsThatAreActionsSubscription,
  SubscriptionSubgraphEventsSubscription,
} from '~data/index';
import {
  Address,
  ColonyActions,
  FormattedAction,
  FormattedEvent,
  ColonyAndExtensionsEvents,
} from '~types/index';
import { ACTIONS_EVENTS } from '~dashboard/ActionsPage/staticMaps';
import { getValuesForActionType } from '~utils/colonyActions';
import { TEMP_getContext, ContextModule } from '~context/index';
import { createAddress } from '~utils/web3';
import { formatEventName, groupSetUserRolesActions } from '~utils/events';
import { log } from '~utils/debug';

export const getActionsListData = (
  unformattedActions?: {
    oneTxPayments?: SubscriptionSubgraphOneTxSubscription['oneTxPayments'];
    events?: SubscriptionSubgraphEventsThatAreActionsSubscription['events'];
  },
  transactionsCommentsCount?: TransactionsMessagesCount,
  oneTxPaymentExtensionAddress?: Address | null,
): FormattedAction[] => {
  let formattedActions = [];
  /*
   * Filter out the move funds actions that are actually payment actions (before processing)
   *
   * This happens because internally the oneTxAction also triggers a Move Funds and
   * we don't consider that one an action
   *
   * We only consider an action that we manually trigger ourselves, so if the transaction
   * hashes match, throw them out.
   */
  const filteredUnformattedActions = {
    oneTxPayments: unformattedActions?.oneTxPayments || [],
    events:
      unformattedActions?.events?.reduce((acc, event) => {
        if (
          formatEventName(event.name) ===
          ColonyAndExtensionsEvents.DomainMetadata
        ) {
          const linkedDomainAddedEvent = (
            unformattedActions?.events || []
          ).find(
            (e) =>
              formatEventName(e.name) ===
                ColonyAndExtensionsEvents.DomainAdded &&
              e.transaction?.hash === event.transaction?.hash,
          );
          if (linkedDomainAddedEvent) return acc;
        }
        /* filtering out events that are already shown in `oneTxPayments` */
        const isTransactionRepeated = unformattedActions?.oneTxPayments?.some(
          (paymentAction) =>
            paymentAction.transaction?.hash === event.transaction?.hash,
        );
        if (isTransactionRepeated) return acc;

        return [...acc, event];
      }, []) || [],
  };

  Object.keys(filteredUnformattedActions || {}).map((subgraphActionType) => {
    formattedActions = formattedActions.concat(
      (filteredUnformattedActions || {})[subgraphActionType].map(
        (unformattedAction) => {
          const formatedAction = {
            id: unformattedAction.id,
            actionType: ColonyActions.Generic,
            initiator: AddressZero,
            recipient: AddressZero,
            amount: '0',
            tokenAddress: AddressZero,
            symbol: '???',
            decimals: '18',
            fromDomain: '1',
            toDomain: '1',
            transactionHash: HashZero,
            createdAt: new Date(),
            commentCount: 0,
          };
          let hash;
          let timestamp;
          try {
            const {
              transaction: {
                hash: txHash,
                block: { timestamp: blockTimestamp },
              },
            } = unformattedAction;
            hash = txHash;
            timestamp = blockTimestamp;
          } catch (error) {
            log.verbose('Could not deconstruct the subgraph action object');
            log.verbose(error);
          }
          const transactionComments =
            /*
             * @NOTE Had to disable this as prettier was being too whiny
             * and all suggestions it made broke the style rules
             *
             * This sadly happens from time to time...
             */
            // disable-next-list prettier/prettier
            transactionsCommentsCount?.colonyTransactionMessages?.find(
              ({ transactionHash }) => transactionHash === hash,
            );
          if (subgraphActionType === 'oneTxPayments') {
            try {
              const {
                payment: {
                  to: recipient,
                  domain: { ethDomainId },
                  fundingPot: {
                    fundingPotPayouts: [
                      {
                        amount,
                        token: { address: tokenAddress, symbol, decimals },
                      },
                    ],
                  },
                },
              } = unformattedAction;
              formatedAction.actionType = ColonyActions.Payment;
              formatedAction.recipient = recipient;
              formatedAction.fromDomain = ethDomainId;
              formatedAction.amount = amount;
              formatedAction.tokenAddress = tokenAddress;
              formatedAction.symbol = symbol;
              formatedAction.decimals = decimals;
              if (unformattedAction?.agent) {
                formatedAction.initiator = unformattedAction.agent;
              }
            } catch (error) {
              log.verbose(
                'Could not deconstruct the subgraph oneTx action object',
              );
              log.verbose(error);
            }
          }
          if (transactionsCommentsCount && transactionComments) {
            formatedAction.commentCount = transactionComments.count;
          }
          if (timestamp) {
            formatedAction.createdAt = new Date(
              /*
               * @NOTE blocktime is expressed in seconds, and we need milliseconds
               * to instantiate the correct Date object
               */
              parseInt(`${timestamp}000`, 10),
            );
          }
          if (subgraphActionType === 'events') {
            try {
              const {
                processedValues,
                associatedColony: {
                  token: { address: tokenAddress, symbol, decimals },
                },
                name,
              } = unformattedAction;
              const actionEvent = Object.entries(ACTIONS_EVENTS).find((el) =>
                el[1]?.includes(name.split('(')[0]),
              );
              const actionType =
                (actionEvent && (actionEvent[0] as ColonyActions)) ||
                ColonyActions.Generic;
              formatedAction.actionType = actionType;
              formatedAction.tokenAddress = tokenAddress;
              formatedAction.symbol = symbol;
              formatedAction.decimals = decimals;
              const actionTypeValues = getValuesForActionType(
                processedValues,
                actionType,
              );
              const actionTypeKeys = Object.keys(actionTypeValues);
              actionTypeKeys.forEach((key) => {
                formatedAction[key] = actionTypeValues[key];
              });
            } catch (error) {
              log.verbose('Could not deconstruct the subgraph event object');
              log.verbose(error);
            }
          }
          formatedAction.transactionHash = hash;
          return formatedAction;
        },
      ),
    );
    return null;
  });

  const formattedGroupedActions = groupSetUserRolesActions(formattedActions);

  /*
   * @NOTE Filter out the initial 'Colony Edit' action, if it comes from the
   * network contract (not the current colony).
   *
   * This is the first edit action that gets created, and shares the same
   * transaction hash with the 'Domain Added' action (basically all actions
   * that get created intially, when creating a new colony, will share the
   * same tx hash)
   *
   * Since we can't link to two separate actions on the same hash, we filter
   * out one of them, as since the metadata change is less important (and it's
   * not actually a change, but a "set") we filter it out
   */
  return formattedGroupedActions.filter(
    ({ initiator, recipient, actionType }: FormattedAction) => {
      /*
       * @NOTE This is wrapped inside a try/catch block since if the user logs out,
       * for a brief moment the colony manager won't exist
       *
       * If that's at the same time as this filter runs, it will error out, so we
       * prevent that by just returning an empty list
       *
       * How I **hate** race conditions
       */
      try {
        const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
        if (
          colonyManager?.networkClient &&
          (actionType === ColonyActions.ColonyEdit ||
            actionType === ColonyActions.SetUserRoles)
        ) {
          return (
            initiator !== colonyManager?.networkClient.address.toLowerCase() &&
            oneTxPaymentExtensionAddress?.toLowerCase() !== recipient
          );
        }
        return true;
      } catch (error) {
        return false;
      }
    },
  );
};

export const getEventsListData = (
  unformattedEvents?: SubscriptionSubgraphEventsSubscription,
): FormattedEvent[] | undefined =>
  unformattedEvents?.events?.reduce((processedEvents, event) => {
    if (!event) {
      return processedEvents;
    }
    try {
      const {
        id,
        associatedColony: { colonyAddress },
        transaction: {
          hash,
          block: { timestamp },
        },
        name,
        args,
      } = event;
      const {
        agent,
        domainId,
        recipient,
        fundingPotId,
        metadata,
        token,
        paymentId,
        amount,
        payoutRemainder,
        decimals = '18',
        role,
        setTo,
        user,
      } = JSON.parse(args || '{}');
      const checksummedColonyAddress = createAddress(colonyAddress);
      const getRecipient = () => {
        if (recipient) {
          return createAddress(recipient);
        }
        if (user) {
          return user;
        }
        return checksummedColonyAddress;
      };
      return [
        ...processedEvents,
        {
          id,
          agent: agent ? createAddress(agent) : null,
          eventName: formatEventName(name),
          transactionHash: hash,
          colonyAddress: checksummedColonyAddress,
          createdAt: new Date(parseInt(`${timestamp}000`, 10)),
          displayValues: args,
          domainId: domainId || null,
          recipient: getRecipient(),
          fundingPot: fundingPotId,
          metadata,
          tokenAddress: token ? createAddress(token) : null,
          paymentId,
          decimals: parseInt(decimals, 10),
          amount: amount || payoutRemainder || '0',
          role,
          setTo: setTo === 'true',
        },
      ];
    } catch (error) {
      log.verbose('Could not deconstruct the subgraph event object');
      log.verbose(error);
      return processedEvents;
    }
  }, []);
