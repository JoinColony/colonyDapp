import { AddressZero, HashZero } from 'ethers/constants';

import { SubgraphActions, TransactionsMessagesCount } from '~data/index';
import { ColonyActions, FormattedAction } from '~types/index';

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
            initiator: unformattedAction.agent,
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
          formatedAction.transactionHash = hash;
          return formatedAction;
        },
      ),
    );
    return null;
  });
  return formattedActions;
};
