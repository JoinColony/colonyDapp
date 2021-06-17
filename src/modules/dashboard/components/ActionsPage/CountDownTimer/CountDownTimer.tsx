import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  MutableRefObject,
  useMemo,
} from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { bigNumberify } from 'ethers/utils';

import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  useMotionTimeoutPeriodsQuery,
  Colony,
  useLoggedInUser,
} from '~data/index';
import { MotionTimeoutPeriods } from '~data/generated';
import { splitTimeLeft } from '~utils/time';
import { MotionState } from '~utils/colonyMotions';
import { ActionTypes } from '~redux/index';

import styles from './CountDownTimer.css';

const MSG = defineMessage({
  title: {
    id: 'dashboard.ActionsPage.CountDownTimer.title',
    defaultMessage: `{motionState, select,
      Staking {Time left to stake}
      Staked {Motion will pass in}
      Objection {Motion will fail in}
      Voting {Voting ends in}
      Reveal {Reveal ends in}
      Escalation {Time left to escalate}
      other {Timeout}
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
  colony: Colony;
  state: MotionState;
  motionId: number;
  timeoutPeriods?: MotionTimeoutPeriods;
}

const displayName = 'dashboard.ActionsPage.CountDownTimer';

const CountDownTimer = ({
  colony: { colonyAddress },
  state,
  motionId,
  timeoutPeriods,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const dispatch = useDispatch();
  const { data: queryData, loading, refetch } = useMotionTimeoutPeriodsQuery({
    variables: {
      colonyAddress,
      motionId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const data = useMemo(
    () =>
      timeoutPeriods === undefined
        ? queryData?.motionTimeoutPeriods
        : timeoutPeriods,
    [timeoutPeriods, queryData],
  );

  const currentStatePeriod = useCallback(() => {
    switch (state) {
      case MotionState.Staking:
      case MotionState.Staked:
      case MotionState.Objection:
        return data?.timeLeftToStake || -1;
      case MotionState.Voting:
        return data?.timeLeftToSubmit || -1;
      case MotionState.Reveal:
        return data?.timeLeftToReveal || -1;
      case MotionState.Escalation:
        return data?.timeLeftToEscalate || -1;
      default:
        return -1;
    }
  }, [data, state]);

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  const prevStateRef: MutableRefObject<MotionState | null> = useRef(null);
  const isStakingPhaseState =
    state === MotionState.Staking ||
    state === MotionState.Staked ||
    state === MotionState.Objection;
  /*
   * Set the initial timeout
   *
   * @NOTE The extra 5 seconds are to account for the time in between the blockchain
   * timeout being hit and the next block being processed.
   *
   * If there are no blockes being processes between the time the motion "should" finish
   * and the time we refresh the state (because we are basically keeping a parallel time count)
   * the state of the motion won't change.
   *
   * This is confusing UX and might need revisiting in the future with some clever messages
   * for the user to let them know what's going on
   *
   * So we are "faking" this by adding an extra 5 to the alloted time, so that the
   * blockchain has time to process any transactions, detect the motion's timeout,
   * and change the state so we can refresh it.
   */
  useEffect(() => {
    if (
      data &&
      state &&
      ((prevStateRef.current === null && isStakingPhaseState) ||
        !isStakingPhaseState)
    ) {
      const period = currentStatePeriod() / 1000;
      setTimeLeft(period > 0 ? period + 5 : period);
      prevStateRef.current = state;
    }
  }, [data, currentStatePeriod, prevStateRef, state, isStakingPhaseState]);

  /*
   * Count it down
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    if (timeLeft === 0) {
      dispatch({
        type: ActionTypes.COLONY_MOTION_STATE_UPDATE,
        payload: {
          colonyAddress,
          motionId: bigNumberify(motionId),
          userAddress: walletAddress,
        },
      });
    }
    if (timeLeft < 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [
    timeLeft,
    currentStatePeriod,
    dispatch,
    colonyAddress,
    motionId,
    walletAddress,
  ]);

  useEffect(() => {
    if (data && !isStakingPhaseState) {
      refetch();
    }
  }, [isStakingPhaseState, data, refetch, state]);

  /*
   * Split the time into h/m/s for display purpouses
   */
  const splitTime = splitTimeLeft(timeLeft);

  if (loading || !data) {
    return <MiniSpinnerLoader loadingText={MSG.loadingText} />;
  }

  if (splitTime === undefined) {
    return null;
  }

  return (
    <div className={styles.container}>
      <FormattedMessage {...MSG.title} values={{ motionState: state }} />
      <span className={styles.time}>
        {splitTime.days > 0 && (
          <FormattedMessage {...MSG.days} values={{ days: splitTime.days }} />
        )}
        {(splitTime.days > 0 || splitTime.hours > 0) && (
          <FormattedMessage
            {...MSG.hours}
            values={{ hours: splitTime.hours }}
          />
        )}
        {(splitTime.days > 0 || splitTime.hours > 0 || splitTime.minutes) >
          0 && (
          <FormattedMessage
            {...MSG.minutes}
            values={{ minutes: splitTime.minutes }}
          />
        )}
        <FormattedMessage
          {...MSG.seconds}
          values={{ seconds: splitTime.seconds }}
        />
      </span>
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
