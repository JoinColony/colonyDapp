import { useEffect, useRef, useState } from 'react';

import { insufficientFundsEventTrigger } from '../Stages/StreamingStages/StreamingStagesLocked/constants';

const useInsufficientFunds = (index: number) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasRateError, setHasRateError] = useState<boolean>(false);
  const [hasLimitError, setHasLimitError] = useState<boolean>(false);

  useEffect(() => {
    const handleInsufficientFunds = (e: CustomEvent) => {
      const {
        detail: { index: itemIndex, rateError, limitError },
      } = e;

      if (itemIndex === index && rateError) {
        setHasRateError(true);
      }

      if (itemIndex === index && limitError) {
        setHasLimitError(true);
      }
    };

    window.addEventListener(
      insufficientFundsEventTrigger,
      handleInsufficientFunds,
    );

    return () => {
      window.removeEventListener(
        insufficientFundsEventTrigger,
        handleInsufficientFunds,
      );
    };
  }, [index]);

  return { ref, hasRateError, hasLimitError };
};

export default useInsufficientFunds;
