import React, { useEffect, useState } from 'react';
import { FormattedMessage, MessageDescriptor, defineMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~core/Preloaders';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { useBlockTimeQuery } from '~data/index';
import { Address } from '~types/index';
import { calculateTimeLeft } from '~utils/time';
import { MotionState } from '~utils/colonyMotions';

import styles from './CountDownTimer.css';

const MSG = defineMessage({
  title: {
    id: 'dashboard.ActionsPage.CountDownTimer.title',
    defaultMessage: `{motionState, select,
      StakeRequired {Time left to stake}
      Motion {Motion will pass in}
      Objection {Motion will fail in}
      Voting {Voting ends in}
      Reveal {Reveal ends in}
      Escalation {Time left to escalate}
      Other {Timeout}
    }`,
  },
  days: {
    id: 'dashboard.ActionsPage.CountDownTimer.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'dashboard.ActionsPage.CountDownTimer.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'dashboard.ActionsPage.CountDownTimer.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'dashboard.ActionsPage.CountDownTimer.seconds',
    defaultMessage: ' {seconds}s',
  },
  loadingText: {
    id: 'dashboard.ActionsPage.CountDownTimer.loadingText',
    defaultMessage: 'Loading countdown period',
  },
});

interface Props {
  createdAt: number;
  colonyAddress: Address;
  tooltipText?: MessageDescriptor | string;
  state: MotionState;
}

const displayName = 'dashboard.ActionsPage.CountDownTimer';

const CountDownTimer = ({
  colonyAddress,
  createdAt,
  tooltipText,
  state,
}: Props) => {
  // const { data: blockTimeData } = useBlockTimeQuery();

  // const differenceVsBCTime = blockTimeData?.blockTime
  //   ? blockTimeData?.blockTime - Date.now()
  //   : 0;

  // const [timeLeft, setTimeLeft] = useState(
  //   calculateTimeLeft(createdAt, differenceVsBCTime, 0),
  // );

  // useEffect(() => {
  //   if (undefined !== 0) {
  //     const timer = setInterval(() => {
  //       setTimeLeft(calculateTimeLeft(createdAt, differenceVsBCTime, 0));
  //     }, 1000);
  //     return () => clearInterval(timer);
  //   }
  //   return undefined;
  // }, [createdAt, stakePeriod, differenceVsBCTime]);

  // if (
  //   loading ||
  //   data === undefined ||
  //   blockTimeData === undefined ||
  //   (timeLeft === undefined &&
  //     calculateTimeLeft(createdAt, differenceVsBCTime, stakePeriod) !==
  //       undefined)
  // ) {
  //   return <MiniSpinnerLoader loadingText={MSG.loadingText} />;
  // }

  // if (timeLeft === undefined) {
  //   return null;
  // }

  return (
    <div className={styles.container}>
      <FormattedMessage {...MSG.title} values={{ motionState: state }} />
      {/* <span className={styles.time}>
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
      </span> */}
      {tooltipText && (
        <QuestionMarkTooltip
          className={styles.tooltipIcon}
          tooltipText={tooltipText}
        />
      )}
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
