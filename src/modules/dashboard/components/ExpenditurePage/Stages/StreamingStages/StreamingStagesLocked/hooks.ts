import { useState } from 'react';
import moveDecimal from 'move-decimal-point';
import { isEmpty, uniq } from 'lodash';
import { BigNumber, bigNumberify } from 'ethers/utils';

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

export const useClaimStreamingPayment = (
  initialAvailableToClaim?: Rate[],
  initialPaidToDate?: Rate[],
) => {
  // these values are mocks, they're set to state to mock claiming funds functionality
  const [availableToClaim, setAvailableToClaim] = useState<Rate[] | undefined>(
    initialAvailableToClaim,
  );
  const [paidToDate, setPaidToDate] = useState<Rate[] | undefined>(
    initialPaidToDate,
  );
  const [claimed, setClaimed] = useState(false);

  const claimFunds = () => {
    if (!availableToClaim) {
      return;
    }
    const newPaidToDate = [...(paidToDate || []), ...availableToClaim].reduce(
      (acc: Rate[], curr: Rate) => {
        const { amount, token } = curr || {};
        if (!amount || !token) {
          return acc;
        }
        const tokenInAcc = acc.find((accItem) => accItem.token === token);
        if (tokenInAcc) {
          return acc.map((accItem) => {
            if (accItem.token === token) {
              return { ...accItem, amount: Number(tokenInAcc.amount) + amount };
            }
            return accItem;
          });
        }
        return [...acc, curr];
      },
      [],
    );

    setPaidToDate(newPaidToDate);
    // it's a mock, it just sets available amount to 0
    setAvailableToClaim((available) =>
      available?.map((availableItem) => ({ ...availableItem, amount: 0 })),
    );
    setClaimed(true);
  };

  return {
    availableToClaim,
    paidToDate,
    claimFunds,
    claimed,
    setAvailableToClaim,
  };
};

export const useAvailableFundsInTeam = ({
  fundingSources,
  colony,
}: {
  fundingSources?: FundingSource[];
  colony?: Colony;
}) => {
  const { colonyAddress, domains, tokens: colonyTokens } = colony || {};
  const domainIds = fundingSources?.map((fundingSource) => {
    const domain = domains?.find(
      ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
    );
    return domain?.ethDomainId || 0;
  });

  const { data } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress: colonyAddress || '',
      domainIds,
      tokenAddresses: colonyTokens?.map((token) => token.address || '') || [''],
    },
    fetchPolicy: 'network-only',
  });

  // checking each funding source - if team has enough balance
  const notFundedTeams = fundingSources?.reduce<{
    tokens: string[];
    teams: string[];
  }>(
    (accumulator, fundingSource) => {
      // calculate tokens, create an array with rates summed by token id
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
        // if token has already been added to the tokensSum array, then add to the exisitng object
        if (acc?.find((accItem) => accItem?.token === curr.token)) {
          return acc.map((accItem) =>
            accItem?.token === curr.token
              ? { ...accItem, amount: accItem.amount.add(convertedAmount) }
              : accItem,
          );
        }
        // if not added, then add a new object with token
        return [...acc, { token: curr.token, amount: convertedAmount }];
      }, []);
      const domain = domains?.find(
        ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
      );

      // if team from funding source hasn't got enough balance,
      // then add the tokenId to the notEnoughBalances array
      const notEnoughBalances = tokensSum.reduce<string[]>((acc, curr) => {
        const tokenItem = data?.tokens.find((token) => token.id === curr.token);
        const tokenBalance = getBalanceFromToken(
          tokenItem,
          domain?.ethDomainId,
        );

        if (tokenBalance.lt(curr.amount)) {
          return [...acc, curr.token];
        }
        return acc;
      }, []);

      return isEmpty(notEnoughBalances)
        ? accumulator
        : {
            teams: [...accumulator.teams, fundingSource.team],
            tokens: [...accumulator.tokens, ...notEnoughBalances],
          };
    },
    { teams: [], tokens: [] },
  );
  const { teams, tokens } = notFundedTeams || {};
  const teamsWithError = {
    teams: uniq(teams),
    tokens: uniq(tokens),
  };

  return teamsWithError;
};
