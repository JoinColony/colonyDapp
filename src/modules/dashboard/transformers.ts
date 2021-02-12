import { AddressZero, HashZero } from 'ethers/constants';

import {
  SubgraphActions,
  SubgraphEvents,
  TransactionsMessagesCount,
} from '~data/index';
import {
  Address,
  ColonyActions,
  FormattedAction,
  FormattedEvent,
} from '~types/index';
import { ACTIONS_EVENTS } from '~dashboard/ActionsPage/staticMaps';
import { getValuesForActionType } from '~utils/colonyActions';
import { TEMP_getContext, ContextModule } from '~context/index';
import { createAddress } from '~utils/web3';
import { formatEventName, groupSetUserRolesActions } from '~utils/events';

export const getActionsListData = (
  unformattedActions?: SubgraphActions,
  transactionsCommentsCount?: TransactionsMessagesCount,
  oneTxPaymentExtensionAddress?: Address | null,
): FormattedAction[] => {
  let formattedActions = [];

  Object.keys(unformattedActions || {}).map((subgraphActionType) => {
    formattedActions = formattedActions.concat(
      (unformattedActions || {})[subgraphActionType].map(
        (unformattedAction) => {
          const formattedAction = {
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
          const {
            transaction: {
              hash,
              block: { timestamp },
            },
          } = unformattedAction;
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
            formattedAction.actionType = ColonyActions.Payment;
            formattedAction.recipient = recipient;
            formattedAction.fromDomain = ethDomainId;
            formattedAction.amount = amount;
            formattedAction.tokenAddress = tokenAddress;
            formattedAction.symbol = symbol;
            formattedAction.decimals = decimals;
            formattedAction.initiator = unformattedAction.agent;
          }
          if (transactionsCommentsCount && transactionComments) {
            formattedAction.commentCount = transactionComments.count;
          }
          if (timestamp) {
            formattedAction.createdAt = new Date(
              /*
               * @NOTE blocktime is expressed in seconds, and we need milliseconds
               * to instantiate the correct Date object
               */
              parseInt(`${timestamp}000`, 10),
            );
          }
          if (subgraphActionType === 'events') {
            const {
              args,
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
            formattedAction.actionType = actionType;
            formattedAction.tokenAddress = tokenAddress;
            formattedAction.symbol = symbol;
            formattedAction.decimals = decimals;
            const actionTypeValues = getValuesForActionType(args, actionType);
            const actionTypeKeys = Object.keys(actionTypeValues);
            actionTypeKeys.forEach((key) => {
              formattedAction[key] = actionTypeValues[key];
            });
          }
          formattedAction.transactionHash = hash;
          return formattedAction;
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
  unformattedEvents?: SubgraphEvents,
): FormattedEvent[] | undefined =>
  unformattedEvents?.events?.reduce((processedEvents, event) => {
    if (!event) {
      return processedEvents;
    }
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
  }, []);
