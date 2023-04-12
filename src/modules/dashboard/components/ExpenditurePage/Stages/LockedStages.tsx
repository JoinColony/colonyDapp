import React, { useCallback, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

import { isEmpty } from 'lodash';
import Tag from '~core/Tag';
import { Colony } from '~data/index';
import {
  ExpenditureTypes,
  StageObject,
  ValuesType,
} from '~pages/ExpenditurePage/types';

import { Motion, MotionStatus, MotionType, Status } from './constants';
import LinkedMotions from './LinkedMotions';
import Stages, { Appearance } from './Stages';
import StreamingStagesLocked from './StreamingStages/StreamingStagesLocked';
import { ViewFor } from './LinkedMotions/LinkedMotions';
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
  motion?: Motion[] | Motion;
  status?: Status;
  handleCancel?: () => void;
  colony: Colony;
  expenditureType?: ExpenditureTypes;
  formValues?: ValuesType;
  appearance?: Appearance;
  viewFor?: ViewFor;
}

const LockedStages = ({
  stages,
  activeStageId,
  setActiveStageId,
  motion,
  status,
  handleCancel,
  formValues,
  colony,
  expenditureType,
  viewFor,
}: Props) => {
  const activeStage = stages.find((stage) => stage.id === activeStageId);
  const { formatMessage } = useIntl();
  const isStreamingPaymentType =
    formValues?.expenditure === ExpenditureTypes.Streaming;

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

  // searching for motion in pending state is a mock. Will be replaced with call to backend
  const pendingMotion = useMemo(
    () =>
      Array.isArray(motion)
        ? motion?.find(
            (motionItem) => motionItem.status === MotionStatus.Pending,
          )
        : motion?.status === MotionStatus.Pending,
    [motion],
  );

  return (
    <div className={styles.tagStagesWrapper}>
      {pendingMotion && !isStreamingPaymentType && (
        <Tag
          appearance={{
            theme: 'golden',
            colorSchema: 'fullColor',
          }}
        >
          {typeof pendingMotion === 'object' &&
          'type' in pendingMotion &&
          pendingMotion.type === MotionType.Edit
            ? formatMessage(MSG.activeMotion)
            : formatMessage(MSG.motion, {
                action: formattedLabel(activeStage?.buttonText),
              })}
        </Tag>
      )}
      {isStreamingPaymentType ? (
        <StreamingStagesLocked
          status={status}
          motion={Array.isArray(motion) ? undefined : motion}
          colony={colony}
          activeStageId={activeStageId}
          handleCancel={handleCancel}
          fundingSources={formValues?.streaming?.fundingSources}
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
            handleCancel,
            formValues,
            colony,
            expenditureType,
          }}
          activeLine
        />
      )}
      {motion && !isEmpty(motion) && (
        <LinkedMotions motion={motion} viewFor={viewFor} />
      )}
    </div>
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
