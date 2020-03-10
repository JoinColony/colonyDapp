import { useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import moveDecimal from 'move-decimal-point';

import { useDialog } from '~core/Dialog';
import TaskFinalizeDialog from './TaskFinalizeDialog';

import {
  Payouts,
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';
import { bnLessThan } from '~utils/numbers';

const useDomainFundsCheck = (
  colonyAddress: string,
  payouts: Payouts,
  domainId: number,
) => {
  const openDialog = useDialog(TaskFinalizeDialog);
  const apolloClient = useApolloClient();
  const tokenAddresses = payouts.map(({ token }) => token.address);

  return useCallback(async () => {
    const { data } = await apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: { colonyAddress, tokenAddresses, domainIds: [domainId] },
    });
    const enoughFundsAvailable = payouts.every(({ amount, tokenAddress }) => {
      const domainBalances =
        data &&
        data.tokens.find(
          ({ address: domainTokenAddress }) =>
            domainTokenAddress === tokenAddress,
        );
      if (!domainBalances) {
        return false;
      }
      return domainBalances.balances.every(
        ({ amount: availableDomainAmount }) =>
          !bnLessThan(
            availableDomainAmount,
            moveDecimal(amount, domainBalances.decimals || 18),
          ),
      );
    });
    if (!enoughFundsAvailable) {
      await openDialog().afterClosed();
      return false;
    }
    return true;
  }, [
    apolloClient,
    colonyAddress,
    tokenAddresses,
    domainId,
    payouts,
    openDialog,
  ]);
};

export default useDomainFundsCheck;
