import { useMemo, useState } from 'react';
import { isEmpty, uniq } from 'lodash';
import { BigNumber, bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import {
  FundingSource,
  Rate,
} from '~dashboard/ExpenditurePage/Streaming/types';
import { Colony } from '~data/index';
import { useTokenBalancesForDomainsQuery } from '~data/generated';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { calcTokensFromRates, calculateTokens } from '../../utils';

interface ClaimProps {
  fundingSources?: FundingSource[];
  paidTokens?: Rate[];
  colony?: Colony;
}

export const useClaimStreamingPayment = ({
  fundingSources,
  paidTokens,
  colony,
}: ClaimProps) => {
  const { colonyAddress, tokens: colonyTokens } = colony || {};

  const domainIds = uniq(
    fundingSources?.map((fundingSource) => Number(fundingSource.team) || 0),
  ) || [0];

  const { data } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress: colonyAddress || '',
      domainIds,
      tokenAddresses: colonyTokens?.map((token) => token.address || '') || [''],
    },
    fetchPolicy: 'network-only',
  });

  const insufficientFunds = useMemo(() => {
    /*
     * Checking each funding source - does the team have enough balance?
     */
    const notFundedTeams = fundingSources?.reduce<{
      fundingSources: Record<string, string[]>;
      tokens: string[];
    }>(
      (accumulator, fundingSource) => {
        /*
         * These calculations should be double checked before going on prod.
         * Gas price was not included.
         *
         * The reduce function below sums tokens by token id.
         */

        const tokensSum = fundingSource.rates.reduce<
          { token: string; amount: BigNumber }[]
        >((acc, curr) => {
          if (!curr.token) return acc;

          const tokenObj = colonyTokens?.find(
            (tokenItem) => tokenItem.id === curr.token,
          );
          const convertedAmount = bigNumberify(
            moveDecimal(
              curr.amount,
              getTokenDecimalsWithFallback(tokenObj?.decimals),
            ),
          );

          /*
           * Here we are checking if token has already been added
           * If so, then add the current amount to the exisitng token amount.
           * If not, add token to the array.
           */
          if (acc?.find((accItem) => accItem?.token === curr.token)) {
            return acc.map((accItem) =>
              accItem?.token === curr.token
                ? { ...accItem, amount: accItem.amount.add(convertedAmount) }
                : accItem,
            );
          }

          return [...acc, { token: curr.token, amount: convertedAmount }];
        }, []);

        /*
         * If team from funding source hasn't got enough balance,
         * then add the tokenId to the notEnoughBalances array.
         */
        const notEnoughBalances = tokensSum.reduce<string[]>((acc, curr) => {
          const tokenItem = data?.tokens.find(
            (token) => token.id === curr.token,
          );

          const tokenBalance = getBalanceFromToken(
            tokenItem,
            Number(fundingSource.team),
          );

          if (tokenBalance.lt(curr.amount)) {
            return [...acc, curr.token];
          }
          return acc;
        }, []);

        /*
         * If "notEnoughBalances" array is not empty, then there are not enough funds in the team.
         * In this case, add the team ID to the teams object and the token IDs to the token array.
         */
        return isEmpty(notEnoughBalances)
          ? accumulator
          : {
              fundingSources: {
                ...accumulator.fundingSources,
                [fundingSource.id]: notEnoughBalances,
              },
              tokens: [...accumulator.tokens, ...notEnoughBalances],
            };
      },
      { fundingSources: {}, tokens: [] },
    );

    /*
     * Token IDs can be repeated, so we call the uniq function on the tokens array
     */

    return {
      fundingSources: notFundedTeams?.fundingSources,
      tokens: uniq(notFundedTeams?.tokens),
    };
  }, [colonyTokens, data, fundingSources]);

  /*
   * Claiming funds is a mock
   */
  const [availableToClaim, setAvailableToClaim] = useState<
    FundingSource[] | undefined
  >(fundingSources);

  const [paidToDate, setPaidToDate] = useState<Rate[] | undefined>(paidTokens);

  const [claimed, setClaimed] = useState(false);

  const usedTokens = useMemo(() => {
    return calculateTokens(fundingSources);
  }, [fundingSources]);

  const calculatedAvailable = useMemo(() => {
    const tokensSum = calculateTokens(availableToClaim);
    if (!tokensSum || isEmpty(tokensSum)) {
      return usedTokens?.map((paidItem) => ({
        ...paidItem,
        amount: 0,
      }));
    }
    return tokensSum;
  }, [availableToClaim, usedTokens]);

  const claimFunds = () => {
    if (!availableToClaim) {
      return;
    }

    const newPaidToDate: Rate[] = [];
    const newAvailable = availableToClaim
      .map((fundingSourceItem) => {
        /*
         * Check if funding source is in insufficient funds array
         */
        const hasNotEnoughFunds = Object.keys(
          insufficientFunds.fundingSources || {},
        ).find((key) => key === fundingSourceItem.id);

        /*
         * If team has enough funds, then remove it from the available array
         */
        if (!hasNotEnoughFunds) {
          newPaidToDate.push(
            ...fundingSourceItem.rates.map((item) => ({
              ...item,
              isClaimable: false,
            })),
          );
          return undefined; // funding source claimed
        }
        /*
         * One or all of the tokens do not have sufficient funds
         */
        const tokensWithUnsufficientFunds =
          insufficientFunds.fundingSources?.[fundingSourceItem.id];

        const newFundingSourceItem = {
          ...fundingSourceItem,
          rates: fundingSourceItem.rates
            .map((rateItem) => {
              const notEnoughFunds = tokensWithUnsufficientFunds?.find(
                (notFundedItem) => notFundedItem === rateItem.token,
              );
              if (!notEnoughFunds) {
                newPaidToDate.push(rateItem);
                return undefined;
              }

              return { ...rateItem, isClaimable: !notEnoughFunds };
            })
            .filter((rateItem) => !!rateItem),
        };
        return newFundingSourceItem;
      })
      .filter((fundingItem) => !!fundingItem);

    setPaidToDate((oldPaidToDate) => [
      ...(oldPaidToDate || []),
      ...(calcTokensFromRates(newPaidToDate) || []),
    ]);

    setAvailableToClaim(newAvailable as FundingSource[]);
    setClaimed(true);
  };

  return {
    availableToClaim: calculatedAvailable,
    paidToDate,
    claimFunds,
    claimed,
    insufficientFunds,
  };
};
