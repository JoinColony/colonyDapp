import { useEffect, useState } from 'react';

import { splitTimeLeft } from '~utils/time';

export const useSplitTime = (initialTime: number, activeTimer: boolean) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime / 1000);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTimer) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      if (timeLeft === 0) {
        clearInterval(timer);
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, activeTimer]);

  const splitTime = splitTimeLeft(timeLeft);

  return {
    splitTime,
  };
};
