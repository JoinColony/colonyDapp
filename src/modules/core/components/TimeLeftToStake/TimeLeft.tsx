import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

import styles from './TimeLeftToStake.css';
import { calculateTimeLeft } from './calculateTimeLeft';

const MSG = defineMessage({
  days: {
    id: 'TimeLeftToStake.TimeLeft.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'TimeLeftToStake.TimeLeft.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'TimeLeftToStake.TimeLeft.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'TimeLeftToStake.TimeLeft.seconds',
    defaultMessage: ' {seconds}s',
  },
});

interface Props {
  createdAt: number;
  stakePeriod: number;
}

const TimeLeft = ({ createdAt, stakePeriod }: Props) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(createdAt, stakePeriod),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(createdAt, stakePeriod));
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt, stakePeriod]);

  return (
    <span className={styles.time}>
      <FormattedMessage {...MSG.days} values={{ days: timeLeft.days }} />
      <FormattedMessage {...MSG.hours} values={{ hours: timeLeft.hours }} />
      <FormattedMessage
        {...MSG.minutes}
        values={{ minutes: timeLeft.minutes }}
      />
      <FormattedMessage
        {...MSG.seconds}
        values={{ seconds: timeLeft.seconds }}
      />
    </span>
  );
};

export default TimeLeft;
