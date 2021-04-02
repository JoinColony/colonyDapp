import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~core/Preloaders';

import { useVotingExtensionParamsQuery } from '~data/index';
import { Address } from '~types/index';

import styles from './CountDownTimer.css';
import { calculateTimeLeft } from './calculateTimeLeft';

const MSG = defineMessage({
  stake: {
    id: 'CountDownTimer.CountDownTimer.stake',
    defaultMessage: 'Time left to stake',
  },
  motionPass: {
    id: 'CountDownTimer.CountDownTimer.motionPass',
    defaultMessage: 'Motion will pass in',
  },
  motionFail: {
    id: 'CountDownTimer.CountDownTimer.motionFail',
    defaultMessage: 'Motion will fail in',
  },
  reveal: {
    id: 'CountDownTimer.CountDownTimer.reveal',
    defaultMessage: 'Reveal ends in',
  },
  voting: {
    id: 'CountDownTimer.CountDownTimer.voting',
    defaultMessage: 'Voting ends in',
  },
  days: {
    id: 'CountDownTimer.CountDownTimer.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'CountDownTimer.CountDownTimer.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'CountDownTimer.CountDownTimer.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'CountDownTimer.CountDownTimer.seconds',
    defaultMessage: ' {seconds}s',
  },
  loadingText: {
    id: 'CountDownTimer.CountDownTimer.loadingText',
    defaultMessage: 'Loading countdown period',
  },
});

interface Props {
  copyOption: 'stake' | 'motionPass' | 'motionFail' | 'reveal' | 'voting';
  createdAt: number;
  colonyAddress: Address;
}

const CountDownTimer = ({ copyOption, colonyAddress, createdAt }: Props) => {
  const { data, error, loading } = useVotingExtensionParamsQuery({
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

  if (loading) {
    return <MiniSpinnerLoader loadingText={MSG.loadingText} />;
  }

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

export default CountDownTimer;
