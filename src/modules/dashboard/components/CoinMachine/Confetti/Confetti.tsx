import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { bigNumberify } from 'ethers/utils';

import { Address } from '~types/index';
import useWindowSize from '~utils/hooks/useWindowSize';

import { useCurrentPeriodTokensQuery } from '~data/index';

type Props = {
  colonyAddress: Address;
};

const displayName = 'dashboard.CoinMachine.Confetti';

const Confetti = ({ colonyAddress }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const dimensions = useWindowSize();

  const { data: periodTokensData, refetch } = useCurrentPeriodTokensQuery({
    variables: { colonyAddress },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      refetch();
    }, 1000);
    if (show) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (periodTokensData && periodTokensData.currentPeriodTokens) {
      const soldPeriodTokens = bigNumberify(
        periodTokensData.currentPeriodTokens.activeSoldTokens,
      );
      const maxPeriodTokens = bigNumberify(
        periodTokensData.currentPeriodTokens.maxPerPeriodTokens,
      );
      if (soldPeriodTokens.gte(maxPeriodTokens)) {
        setShow(true);
        setTimeout(() => setShow(false), 1000 * 20);
      }
    }
  }, [periodTokensData]);

  return (
    <>
      {show && (
        <ReactConfetti width={dimensions?.width} height={dimensions?.height} />
      )}
    </>
  );
};

Confetti.displayName = displayName;

export default Confetti;
