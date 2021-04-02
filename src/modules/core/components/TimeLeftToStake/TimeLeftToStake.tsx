import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

// import TimeAgo from 'react-timeago';

import { useVotingExtensionParamsQuery } from '~data/index';
import { Address } from '~types/index';

import styles from './TimeLeftToStake.css';
import { calculateTimeLeft } from './calculateTimeLeft';

const MSG = defineMessage({
  stake: {
    id: 'TimeLeftToStake.TimeLeftToStake.stake',
    defaultMessage: 'Time left to stake',
  },
  motionPass: {
    id: 'TimeLeftToStake.TimeLeftToStake.motionPass',
    defaultMessage: 'Motion will pass in',
  },
  motionFail: {
    id: 'TimeLeftToStake.TimeLeftToStake.motionFail',
    defaultMessage: 'Motion will fail in',
  },
  reveal: {
    id: 'TimeLeftToStake.TimeLeftToStake.reveal',
    defaultMessage: 'Reveal ends in',
  },
  voting: {
    id: 'TimeLeftToStake.TimeLeftToStake.voting',
    defaultMessage: 'Voting ends in',
  },
  days: {
    id: 'TimeLeftToStake.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'TimeLeftToStake.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'TimeLeftToStake.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'TimeLeftToStake.seconds',
    defaultMessage: ' {seconds}s',
  },
});

interface Props {
  copyOption: 'stake' | 'motionPass' | 'motionFail' | 'reveal' | 'voting';
  createdAt: number;
  colonyAddress: Address;
}

const TimeLeftToStake = ({ copyOption, colonyAddress, createdAt }: Props) => {
  const { data, error } = useVotingExtensionParamsQuery({
    variables: { colonyAddress },
  });

  const stakePeriod = data?.votingExtensionParams.stakePeriod;

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(createdAt, stakePeriod),
  );

  useEffect(() => {
    if (stakePeriod !== undefined) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(createdAt, stakePeriod));
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [createdAt, stakePeriod]);

  if (data === undefined || error || timeLeft === undefined) {
    return null;
  }

  return (
    <div className={styles.container}>
      <FormattedMessage {...MSG[copyOption]} />
      <span className={styles.time}>
        {timeLeft.days > 0 && (
          <FormattedMessage {...MSG.days} values={{ days: timeLeft.days }} />
        )}
        {timeLeft.days > 0 && timeLeft.hours > 0 && (
          <FormattedMessage {...MSG.hours} values={{ hours: timeLeft.hours }} />
        )}
        {timeLeft.days > 0 && timeLeft.hours > 0 && timeLeft.minutes > 0 && (
          <FormattedMessage
            {...MSG.minutes}
            values={{ minutes: timeLeft.minutes }}
          />
        )}
        <FormattedMessage
          {...MSG.seconds}
          values={{ seconds: timeLeft.seconds }}
        />
      </span>
    </div>
  );
};

export default TimeLeftToStake;
