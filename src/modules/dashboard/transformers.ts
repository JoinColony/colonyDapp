import { AddressZero } from 'ethers/constants';

import { SubgraphActions, TransactionsMessagesCount } from '~data/index';
import { ColonyActions } from '~types/index';

export const getActionsListData = (
  unformattedActions?: SubgraphActions,
  transactionsCommentsCount?: TransactionsMessagesCount,
) => {
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
            transactionHash: unformattedAction.transaction.hash,
            /*
             * @TODO Wire up proper date value once the transaction block
             * query has been fixed
             */
            createdAt: new Date(),
            commentCount: 0,
          };
          const transactionComments =
            /*
             * @NOTE Had to disable this as prettier was being too whiny
             * and all suggestions it made broke the style rules
             *
             * This sadly happens from time to time...
             */
            // disable-next-list prettier/prettier
            transactionsCommentsCount?.colonyTransactionMessages?.find(
              ({ transactionHash }) =>
                transactionHash === formatedAction.transactionHash,
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
          return formatedAction;
        },
      ),
    );
    return null;
  });
  /*
   * @NOTE Sort the list with new items first
   *
   * Since the query returns the actions list sorted chronologhical by default
   * we just need to reverse it.
   *
   * This is much faster than sorting this by the `createdAt` prop
   */
  return formattedActions.reverse();
};
