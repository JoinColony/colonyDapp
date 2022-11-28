import { useMemo, useState } from 'react';
import { isEmpty, uniq } from 'lodash';
import { bigNumberify } from 'ethers/utils';

import { FundingSource } from '~dashboard/ExpenditurePage/Streaming/types';
import { Colony } from '~data/index';
import { useTokenBalancesForDomainsQuery } from '~data/generated';
import { getBalanceFromToken } from '~utils/tokens';

import {
  calcTokensFromRates,
  calculateTokens,
  RateWithAmount,
} from '../../utils';

export interface InsufficientError {
  teams: Record<string, string[]>;
  tokens: string[];
}

export const useClaimStreamingPayment = ({
  fundingSources,
  colony,
}: {
  fundingSources?: FundingSource[];
  colony?: Colony;
}) => {
  const { colonyAddress, tokens: colonyTokens } = colony || {};
  /*
   * 1. Find all unique teams from funding sources
   */
  const allTeams = useMemo(
    () => uniq(fundingSources?.map((fundingSource) => fundingSource.team)),
    [fundingSources],
  );

  const [availableToClaim, setAvailableToClaim] = useState<
    RateWithAmount[] | undefined
  >(
    fundingSources
      ? calculateTokens({ funds: fundingSources, colony })
      : undefined,
  );

  const [paidToDate, setPaidToDate] = useState<RateWithAmount[] | undefined>();

  const usedTokens = useMemo(
    () => calculateTokens({ funds: fundingSources, colony }),
    [colony, fundingSources],
  );

  const { data } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress: colonyAddress || '',
      domainIds: allTeams.map((team) => Number(team)),
      tokenAddresses: colonyTokens?.map((token) => token.address || '') || [''],
    },
    fetchPolicy: 'network-only',
  });

  const insufficientFunds = useMemo(() => {
    /*
     * 1. Sum up all tokens form fundingSources by team
     */
    const tokensByTeam = allTeams.reduce<Record<string, RateWithAmount[]>>(
      (acc, curr) => {
        const tokensSum = calculateTokens({
          funds: fundingSources?.filter(
            (fundingSource) => fundingSource.team === curr,
          ),
          colony,
        });

        if (!tokensSum) return acc;

        return { ...acc, [curr]: tokensSum };
      },
      {},
    );
    /*
     * 3. Return errors object with teams and tokens that does not have enough funds
     */
    const teamsWithErrors = Object.entries(tokensByTeam).reduce<
      InsufficientError
    >(
      (acc, curr) => {
        const [team, ratesArr] = curr;

        const notFundedTokens = ratesArr
          .map((rate) => {
            const tokenData = data?.tokens.find(
              (token) => token.id === rate.token,
            );
            const tokenBalance = getBalanceFromToken(tokenData, Number(team));
            if (tokenBalance.lt(rate.amount)) {
              return rate;
            }
            return undefined;
          })
          .filter((item): item is RateWithAmount => !!item);

        return !notFundedTokens || isEmpty(notFundedTokens)
          ? acc
          : {
              teams: {
                ...acc.teams,
                [team]: notFundedTokens
                  .map((rate) => rate.token)
                  .filter((item): item is string => !!item),
              },
              tokens: [
                ...acc.tokens,
                ...notFundedTokens
                  .map((rate) => rate.token)
                  .filter((item): item is string => !!item),
              ],
            };
      },
      { teams: {}, tokens: [] },
    );

    return {
      teams: teamsWithErrors?.teams,
      tokens: uniq(teamsWithErrors?.tokens),
    };
  }, [allTeams, colony, data, fundingSources]);

  /*
   * Claiming funds is a mock
   */

  const claimFunds = () => {
    if (!availableToClaim) {
      return;
    }

    const tokensByTeam = allTeams.reduce<Record<string, RateWithAmount[]>>(
      (acc, curr) => {
        const tokensSum = calculateTokens({
          funds: fundingSources?.filter(
            (fundingSource) => fundingSource.team === curr,
          ),
          colony,
        });

        if (!tokensSum) return acc;

        return { ...acc, [curr]: tokensSum };
      },
      {},
    );

    const newPaidToDate: RateWithAmount[] = [];
    const newAvailable = Object.entries(tokensByTeam).reduce<RateWithAmount[]>(
      (acc, curr) => {
        const [team, ratesArr] = curr;
        /*
         * Check if team is in insufficient funds array
         */
        const hasNotEnoughFunds = Object.keys(
          insufficientFunds.teams || {},
        ).find((key) => key === team);
        /*
         * If team has enough funds, then remove it from the available array
         */
        if (!hasNotEnoughFunds) {
          newPaidToDate.push(
            ...ratesArr.map((item) => ({
              ...item,
              isClaimable: false,
            })),
          );
          return acc;
        }
        /*
         * One or all of the tokens do not have sufficient funds
         */
        const tokensWithUnsufficientFunds = insufficientFunds.teams?.[team];
        const newRates = ratesArr
          .map((rateItem) => {
            const notEnoughFunds = tokensWithUnsufficientFunds?.find(
              (notFundedItem) => notFundedItem === rateItem.token,
            );

            if (!notEnoughFunds) {
              // token has funds
              newPaidToDate.push(rateItem);
              return undefined;
            }
            const tokenData = data?.tokens.find(
              (token) => token.id === rateItem.token,
            );
            const tokenBalance = getBalanceFromToken(tokenData, Number(team));
            /*
             * Claim funds up to the amount held by the team. The missing part leave as available to claim,
             * but with unsufficient funds error.
             */
            newPaidToDate.push({ ...rateItem, amount: tokenBalance });
            return {
              ...rateItem,
              amount: rateItem.amount.sub(tokenBalance),
            };
          })
          .filter((rateItem): rateItem is RateWithAmount => !!rateItem);

        return [...acc, ...newRates];
      },
      [],
    );
    setAvailableToClaim(calcTokensFromRates({ rates: newAvailable, colony }));
    setPaidToDate(calcTokensFromRates({ rates: newPaidToDate, colony }));
  };

  const availableArray = useMemo(() => {
    if (!availableToClaim || !usedTokens) {
      return [];
    }
    if (!availableToClaim || isEmpty(availableToClaim)) {
      return usedTokens.map((paidItem) => ({
        ...paidItem,
        amount: bigNumberify(0),
      }));
    }
    return availableToClaim;
  }, [availableToClaim, usedTokens]);

  return {
    availableToClaim: availableArray,
    paidToDate,
    claimFunds,
    claimed: isEmpty(availableToClaim),
    insufficientFunds,
  };
};
