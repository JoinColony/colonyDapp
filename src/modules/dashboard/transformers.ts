import { AddressZero, HashZero } from 'ethers/constants';

import { SubgraphActions, TransactionsMessagesCount } from '~data/index';
import { ColonyActions, FormattedAction } from '~types/index';
import {
  ACTIONS_EVENTS,
} from '~dashboard/ActionsPage/staticMaps';
import { getValuesForActionType } from '~utils/colonyActions';


export const getActionsListData = (
  unformattedActions?: SubgraphActions,
  transactionsCommentsCount?: TransactionsMessagesCount,
): FormattedAction[] => {
  let formattedActions = [];

  Object.keys(unformattedActions || {}).map((subgraphActionType) => {
    formattedActions = formattedActions.concat(
      (unformattedActions || {})[subgraphActionType].map(
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
            formatedAction.actionType = ColonyActions.Payment;
            formatedAction.recipient = recipient;
            formatedAction.fromDomain = ethDomainId;
            formatedAction.amount = amount;
            formatedAction.tokenAddress = tokenAddress;
            formatedAction.symbol = symbol;
            formatedAction.decimals = decimals;
            formatedAction.initiator = unformattedAction.agent;
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
            const {
              args,
              associatedColony: { token: {address: tokenAddress, symbol, decimals}},
              name,
            } = unformattedAction;
            const actionEvent = Object.entries(ACTIONS_EVENTS).find(el => el[1].includes(unformattedAction.name.split("(")[0]))
            formatedAction.actionType = actionEvent[0];
            formatedAction.tokenAddress = tokenAddress;
            formatedAction.symbol = symbol;
            formatedAction.decimals = decimals;
            const actionTypeValues = getValuesForActionType(args, actionEvent[0]);
            const actionTypeKeys = Object.keys(actionTypeValues);
            actionTypeKeys.forEach(key => {
              formatedAction[key] = actionTypeValues[key];
            })
          }
          formatedAction.transactionHash = hash;
          return formatedAction;
        },
      ),
    );
    return null;
  });
  return formattedActions;
};
