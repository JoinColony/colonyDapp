import React, { useEffect, useState } from 'react';
import { FormattedMessage, MessageDescriptor, defineMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~core/Preloaders';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { useVotingExtensionParamsQuery, useBlockTimeQuery } from '~data/index';
import { Address } from '~types/index';

import styles from './CountDownTimer.css';
import { calculateTimeLeft } from '~utils/time';

const MSG = defineMessage({
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
  text: MessageDescriptor | string;
  periodType:
    | 'stakePeriod'
    | 'submitPeriod'
    | 'revealPeriod'
    | 'escalationPeriod';
  createdAt: number;
  colonyAddress: Address;
  tooltipText?: MessageDescriptor | string;
}

const CountDownTimer = ({
  text,
  colonyAddress,
  createdAt,
  tooltipText,
  periodType,
}: Props) => {
  const { data, error, loading } = useVotingExtensionParamsQuery({
    variables: { colonyAddress },
  });
  const stakePeriod = data?.votingExtensionParams[periodType];
  const { data: blockTimeData } = useBlockTimeQuery();

  const differenceVsBCTime = blockTimeData?.blockTime
    ? blockTimeData?.blockTime - Date.now()
    : 0;

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(createdAt, differenceVsBCTime, stakePeriod),
  );

  useEffect(() => {
    if (stakePeriod !== undefined) {
      const timer = setInterval(() => {
        setTimeLeft(
          calculateTimeLeft(createdAt, differenceVsBCTime, stakePeriod),
        );
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [createdAt, stakePeriod, differenceVsBCTime]);

  if (
    loading ||
    data === undefined ||
    blockTimeData === undefined ||
    (timeLeft === undefined &&
      calculateTimeLeft(createdAt, differenceVsBCTime, stakePeriod) !==
        undefined)
  ) {
    return <MiniSpinnerLoader loadingText={MSG.loadingText} />;
  }

  if (error || timeLeft === undefined) {
    return null;
  }

  return (
    <div className={styles.container}>
      {typeof text === 'string' ? text : <FormattedMessage {...text} />}
      <span className={styles.time}>
        {timeLeft.days > 0 && (
          <FormattedMessage {...MSG.days} values={{ days: timeLeft.days }} />
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <FormattedMessage {...MSG.hours} values={{ hours: timeLeft.hours }} />
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes) > 0 && (
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
      {tooltipText && (
        <QuestionMarkTooltip
          className={styles.tooltipIcon}
          tooltipText={tooltipText}
        />
      )}
    </div>
  );
};

export default CountDownTimer;
