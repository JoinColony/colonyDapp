import { AddressZero, HashZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';

import {
  TransactionsMessagesCount,
  SubgraphOneTxSubscription,
  SubgraphEventsThatAreActionsSubscription,
  SubgraphEventsSubscription,
  SubgraphMotionsSubscription,
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
import { createAddress, toHex } from '~utils/web3';
import { formatEventName, groupSetUserRolesActions } from '~utils/events';
import { log } from '~utils/debug';
import { ItemStatus } from '~core/ActionsList';
import { shouldDisplayMotion } from '~utils/colonyMotions';

enum FilteredUnformattedAction {
  OneTxPayments = 'oneTxPayments',
  Events = 'events',
  Motions = 'motions',
}

interface ActionsThatNeedAttention {
  transactionHash: string;
  needsAction: boolean;
}

interface ActionsTransformerMetadata {
  extensionAddresses?: Address[];
  actionsThatNeedAttention?: ActionsThatNeedAttention[];
}

export const getActionsListData = (
  installedExtensionsAddresses: Address[],
  unformattedActions?: {
    oneTxPayments?: SubgraphOneTxSubscription['oneTxPayments'];
    events?: SubgraphEventsThatAreActionsSubscription['events'];
    motions?: SubgraphMotionsSubscription['motions'];
  },
  transactionsCommentsCount?: TransactionsMessagesCount,
  {
    extensionAddresses,
    actionsThatNeedAttention,
  }: ActionsTransformerMetadata = {},
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
    oneTxPayments:
      unformattedActions?.oneTxPayments?.reduce((acc, action) => {
        if (
          installedExtensionsAddresses?.find(
            (extensionAddress) => extensionAddress === action?.agent,
          )
        ) {
          return acc;
        }
        return [...acc, action];
      }, []) || [],
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

        /*
         * Filter out events that have the recipient or initiator an extension's address
         *
         * This is used to filter out setting root roles to extensions after
         * they have been installed. This also filter out duplicated events
         * which occurs when motion is finalized.
         */
        if (
          extensionAddresses?.find(
            (extensionAddress) =>
              extensionAddress === event?.processedValues?.user ||
              extensionAddress === event?.processedValues?.agent,
          )
        ) {
          return acc;
        }

        return [...acc, event];
      }, []) || [],
    /*
     * Only display motions in the list if their stake reached 10% or
     * if they have been escalated
     */
    motions:
      unformattedActions?.motions?.reduce((acc, motion) => {
        const { requiredStake, stakes, escalated } = motion;
        const totalNayStake = bigNumberify(stakes[0] || 0);
        const totalYayStake = bigNumberify(stakes[1] || 0);
        const currentStake = totalNayStake.add(totalYayStake).toString();
        const enoughStake = shouldDisplayMotion(currentStake, requiredStake);
        if (escalated || enoughStake) {
          return [...acc, motion];
        }
        return acc;
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
            status: undefined,
            motionState: undefined,
            motionId: undefined,
            timeoutPeriods: undefined,
            transactionTokenAddress: undefined,
            blockNumber: 0,
            totalNayStake: '0',
            requiredStake: '0',
            reputationChange: '0',
          };
          let hash;
          let timestamp;
          try {
            const {
              transaction: {
                hash: txHash,
                block: { timestamp: blockTimestamp, id: blockId },
              },
            } = unformattedAction;
            hash = txHash;
            timestamp = blockTimestamp;
            formatedAction.blockNumber = parseInt(
              blockId.replace('block_', ''),
              10,
            );
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
          if (subgraphActionType === FilteredUnformattedAction.OneTxPayments) {
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
              if (tokenAddress === AddressZero) {
                formatedAction.transactionTokenAddress = tokenAddress;
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
          if (subgraphActionType === FilteredUnformattedAction.Events) {
            try {
              const {
                processedValues,
                associatedColony: {
                  colonyAddress,
                  token: { address: tokenAddress, symbol, decimals },
                },
                name,
              } = unformattedAction;
              const actionEvent = Object.entries(ACTIONS_EVENTS).find((el) =>
                el[1]?.includes(name.split('(')[0]),
              );
              const checksummedColonyAddress = createAddress(colonyAddress);
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
                checksummedColonyAddress,
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
          if (subgraphActionType === FilteredUnformattedAction.Motions) {
            const {
              args,
              agent,
              type,
              state,
              fundamentalChainId,
              timeoutPeriods,
              stakes,
              requiredStake,
            } = unformattedAction;

            if (args?.token) {
              const {
                args: {
                  token: { address: tokenAddress, symbol, decimals },
                },
              } = unformattedAction;

              formatedAction.tokenAddress = tokenAddress;
              formatedAction.symbol = symbol;
              formatedAction.decimals = decimals;
            }
            formatedAction.initiator = agent;
            formatedAction.actionType = type;
            formatedAction.motionState = state;
            formatedAction.motionId = fundamentalChainId;
            formatedAction.timeoutPeriods = timeoutPeriods;
            formatedAction.totalNayStake = bigNumberify(
              stakes[0] || 0,
            ).toString();
            formatedAction.requiredStake = requiredStake;
            if (args) {
              const actionTypeKeys = Object.keys(args);
              actionTypeKeys.forEach((key) => {
                formatedAction[key] = args[key];
              });
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
  const filteredActions = formattedGroupedActions.filter(
    ({ initiator, actionType }: FormattedAction) => {
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
          actionType === ColonyActions.ColonyEdit
        ) {
          return (
            initiator !== colonyManager?.networkClient.address.toLowerCase()
          );
        }
        return true;
      } catch (error) {
        return false;
      }
    },
  );

  /*
   * Assign the NeedsAction status to whichever action needs it
   *
   * I wish I could merge this extra map with the other processing steps
   * but for one it's kinda complex and would make the code read harder
   * and second, we need to wait until we've processed everything else in order
   * to determine which actions need a status change.
   *
   * The good part is, that this will trigger **only** if we have actions that
   * need actions, otherwise, it will skip the extra map
   */
  if (actionsThatNeedAttention?.length) {
    return filteredActions.map((action) => {
      const { transactionHash: currentActionTransactionHash } = action;
      const potentialNeedsAction = actionsThatNeedAttention.find(
        ({ transactionHash }) =>
          transactionHash === currentActionTransactionHash,
      );
      if (potentialNeedsAction) {
        return {
          ...action,
          status: potentialNeedsAction.needsAction
            ? ItemStatus.NeedAction
            : undefined,
        };
      }
      return action;
    });
  }
  return filteredActions;
};

export const getEventsListData = (
  unformattedEvents?: SubgraphEventsSubscription,
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
        creator,
        staker,
        escalator,
        domainId,
        newDomainId,
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
        extensionId,
        version,
        oldVersion,
        newVersion,
        slot,
        toValue,
        motionId,
        vote,
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
      const getAgent = () => {
        const userAddress = agent || user || creator || staker || escalator;
        if (userAddress) {
          return createAddress(userAddress);
        }
        return checksummedColonyAddress;
      };
      return [
        ...processedEvents,
        {
          id,
          agent: getAgent(),
          eventName: formatEventName(name),
          transactionHash: hash,
          colonyAddress: checksummedColonyAddress,
          createdAt: new Date(parseInt(`${timestamp}000`, 10)),
          displayValues: args,
          domainId: domainId || null,
          newDomainId: newDomainId || null,
          recipient: getRecipient(),
          fundingPot: fundingPotId,
          metadata,
          tokenAddress: token ? createAddress(token) : null,
          paymentId,
          decimals: parseInt(decimals, 10),
          amount: amount || payoutRemainder || '0',
          role,
          setTo: setTo === 'true',
          extensionHash: extensionId,
          extensionVersion: version,
          oldVersion: oldVersion || '0',
          newVersion: newVersion || '0',
          storageSlot: slot ? toHex(parseInt(slot, 10)) : '0',
          storageSlotValue: toValue || AddressZero,
          motionId,
          vote,
        },
      ];
    } catch (error) {
      log.verbose('Could not deconstruct the subgraph event object');
      log.verbose(error);
      return processedEvents;
    }
  }, []);
