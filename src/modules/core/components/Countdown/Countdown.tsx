import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  className?: string;
  delta?: number;
  msRemaining: number;
}

const displayName = 'Countdown';

const prefix = (num: number) => (num <= 9 ? `0${num}` : num.toString());

const Countdown = ({ className, delta = 1000, msRemaining }: Props) => {
  const [date, setDate] = useState<Date>(new Date(Math.abs(msRemaining)));

  const refreshTime = useCallback(() => {
    setDate((prevDate) => {
      const dif = prevDate.valueOf() - delta;
      return new Date(dif < 0 ? 0 : dif);
    });
    setTimeout(refreshTime, delta);
  }, [delta]);

  useEffect(refreshTime, []);

  const days = date.getUTCDate() - 1;
  const hours = date.getUTCHours() + days * 24;
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return (
    <span className={className}>{`${prefix(hours)}:${prefix(minutes)}:${prefix(
      seconds,
    )}`}</span>
  );
};

Countdown.displayName = displayName;

export default Countdown;
