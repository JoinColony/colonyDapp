import React, { useCallback, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

import Tag from '~core/Tag';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  State,
  ValuesType,
} from '~pages/ExpenditurePage/types';

import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';
import { Recipient } from '../Payments/types';

import { Motion, MotionStatus, MotionType, Status } from './constants';
import LinkedMotions from './LinkedMotions';
import Stages from './Stages';
import StreamingStagesLocked from './StreamingStages/StreamingStagesLocked';

import { useClaimStreamingPayment } from './StreamingStages/StreamingStagesLocked/hooks';
import styles from './Stages.css';

const MSG = defineMessages({
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.LockedStages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
  activeMotion: {
    id: 'dashboard.ExpenditurePage.Stages.LockedStages.activeMotion',
    defaultMessage: 'There is an active motion for this expenditure',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.LockedStages';

interface Props {
  states: State[];
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeStateId?: string;
  motion?: Motion;
  status?: Status;
  handleCancelExpenditure?: () => void;
  recipients?: Recipient[];
  colony: Colony;
  formValues?: ValuesType;
}

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  motion,
  status,
  handleCancelExpenditure,
  colony,
  formValues,
}: Props) => {
  const activeState = states.find((state) => state.id === activeStateId);
  const { formatMessage } = useIntl();
  const isStreamingPaymentType =
    formValues?.expenditure === ExpenditureTypes.Streaming;

  /* This is a mocked claiming function and mocked variables - should to be replaced with call to the backend */
  const {
    availableToClaim,
    paidToDate,
    claimFunds,
  } = useClaimStreamingPayment();

  const handleButtonClick = useCallback(async () => {
    activeState?.buttonAction();
  }, [activeState]);

  const formattedLabel = useMemo(
    () => (text: string | MessageDescriptor | undefined): string => {
      if (undefined) {
        return '';
      }
      if (typeof text === 'string') {
        return text;
      }
      if (typeof text === 'object' && text?.id) {
        return formatMessage(text);
      }
      return '';
    },
    [formatMessage],
  );

  return (
    <div className={styles.tagStagesWrapper}>
      {motion?.status === MotionStatus.Pending && !isStreamingPaymentType && (
        <Tag
          appearance={{
            theme: 'golden',
            colorSchema: 'fullColor',
          }}
        >
          {motion.type === MotionType.Edit &&
          motion.status === MotionStatus.Pending
            ? formatMessage(MSG.activeMotion)
            : formatMessage(MSG.motion, {
                action: formattedLabel(activeState?.buttonText),
              })}
        </Tag>
      )}
      {isStreamingPaymentType ? (
        <StreamingStagesLocked
          handleButtonClick={claimFunds}
          status={status}
          motion={motion}
          colony={colony}
          activeStateId={activeStateId}
          availableToClaim={availableToClaim}
          paidToDate={paidToDate}
        />
      ) : (
        <Stages
          recipients={formValues?.recipients}
          {...{
            states,
            activeStateId,
            setActiveStateId,
            handleButtonClick,
            motion,
            status,
            handleCancelExpenditure,
            colony,
          }}
        />
      )}
      {motion && (
        <LinkedMotions
          status={motion.status}
          motion={motion.type}
          // The id and the link are hardcoded, they should be replaced with actual values.
          // Link should redirect to the motion page
          motionLink={LANDING_PAGE_ROUTE}
          id="25"
        />
      )}
    </div>
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
