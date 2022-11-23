import { useEffect, useRef, useState } from 'react';

import { INSUFFICIENT_FUNDS_EVENT_TRIGGER } from '~pages/ExpenditurePage/constants';

const useInsufficientFunds = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [fundingSourcesError, setfundingSourcesError] = useState<
    Record<string, string[]>
  >();
  const [tokensError, setTokensError] = useState<string[]>();

  useEffect(() => {
    const handleInsufficientFunds = (e: CustomEvent) => {
      const {
        detail: { fundingSources, tokens },
      } = e;

      setfundingSourcesError(fundingSources);
      setTokensError(tokens);
    };

    window.addEventListener(
      INSUFFICIENT_FUNDS_EVENT_TRIGGER,
      handleInsufficientFunds,
    );

    return () => {
      window.removeEventListener(
        INSUFFICIENT_FUNDS_EVENT_TRIGGER,
        handleInsufficientFunds,
      );
    };
  }, []);

  return { ref, fundingSourcesError, tokensError };
};

export default useInsufficientFunds;
