import { useEffect, useState } from 'react';

import { splitTimeLeft } from '~utils/time';

const useSplitTime = (
  initialTime: number,
  activeTimer: boolean,
  periodLength?: number,
) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime / 1000);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTimer) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      }

      if (timeLeft === 0 && periodLength) {
        setTimeLeft(periodLength);
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, activeTimer, periodLength]);

  const splitTime = splitTimeLeft(timeLeft);

  return { timeLeft, splitTime };
};

export default useSplitTime;
