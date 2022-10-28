import React, { useCallback, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

import Tag from '~core/Tag';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  StageObject,
  ValuesType,
} from '~pages/ExpenditurePage/types';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';

import { Motion, MotionStatus, MotionType, Status } from './constants';
import LinkedMotions from './LinkedMotions';
import Stages from './Stages';
import StreamingStagesLocked from './StreamingStages/StreamingStagesLocked';
import styles from './Stages.css';

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
  stages: StageObject[];
  setActiveStageId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeStageId?: string;
  motion?: Motion;
  status?: Status;
  handleCancelExpenditure?: () => void;
  colony: Colony;
  expenditureType?: ExpenditureTypes;
  formValues?: ValuesType;
}

const LockedStages = ({
  stages,
  activeStageId,
  setActiveStageId,
  motion,
  status,
  handleCancelExpenditure,
  formValues,
  colony,
  expenditureType,
}: Props) => {
  const activeStage = stages.find((stage) => stage.id === activeStageId);
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
    activeStage?.buttonAction();
  }, [activeStage]);

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
                action: formattedLabel(activeStage?.buttonText),
              })}
        </Tag>
      )}
      {isStreamingPaymentType ? (
        <StreamingStagesLocked
          handleButtonClick={claimFunds}
          status={status}
          motion={motion}
          colony={colony}
          activeStageId={activeStageId}
          availableToClaim={availableToClaim}
          paidToDate={paidToDate}
          handleCancelExpenditure={handleCancelExpenditure} // Handler function is temporary. Different modal should be displayed here, but it's not ready yet.
        />
      ) : (
        <Stages
          {...{
            stages,
            activeStageId,
            setActiveStageId,
            handleButtonClick,
            motion,
            status,
            handleCancelExpenditure,
            formValues,
            colony,
            expenditureType,
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
