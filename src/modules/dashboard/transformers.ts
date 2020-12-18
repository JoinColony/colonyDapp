import { AddressZero } from 'ethers/constants';

import { SubgraphActions } from '~data/index';
import { ColonyActions } from '~types/index';

export const getActionsListData = (unformattedActions?: SubgraphActions) => {
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
          };
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
          return formatedAction;
        },
      ),
    );
    return null;
  });
  return formattedActions.sort(
    ({ createdAt: first }, { createdAt: second }) => second - first,
  );
};
