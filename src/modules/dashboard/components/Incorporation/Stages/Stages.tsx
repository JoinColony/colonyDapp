import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { StageObject, ValuesType } from '~pages/IncorporationPage/types';
import { Stages as StagesEnum } from '~pages/IncorporationPage/constants';
import { Motion } from '~pages/ExpenditurePage/types';
import {
  MotionStatus,
  Status,
} from '~dashboard/ExpenditurePage/Stages/constants';

import StageItem from './StageItem';
import StagesButton from './StagesButton';
import styles from './Stages.css';
import Tag from '~core/Tag';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.Incorporation.Stages.stages',
    defaultMessage: 'Stages',
  },
  deleteDraft: {
    id: 'dashboard.Incorporation.Stages.deleteDraft',
    defaultMessage: 'Delete draft',
  },
  shareURL: {
    id: 'dashboard.Incorporation.Stages.shareURL',
    defaultMessage: 'Share URL',
  },
  activeMotion: {
    id: 'dashboard.Incorporation.Stages.activeMotion',
    defaultMessage: `There is an active motion. Please wait. `,
  },
});

const displayName = 'dashboard.Incorporation.Stages';

export interface Props {
  stages: StageObject[];
  activeStageId: StagesEnum;
  buttonAction?: (values?: ValuesType) => void;
  handleCancelIncorporation: VoidFunction;
  motion?: Motion;
  status?: Status;
}

const Stages = ({
  stages,
  activeStageId,
  buttonAction,
  handleCancelIncorporation,
  status,
  motion,
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const handleClipboardCopy = () => {
    copyToClipboard(window.location.href);
    setValueIsCopied(true);
    userFeedbackTimer.current = setTimeout(() => setValueIsCopied(false), 2000);
  };

  useEffect(() => () => clearTimeout(userFeedbackTimer.current), [
    userFeedbackTimer,
  ]);

  const isCancelled =
    status === Status.Cancelled || status === Status.ForceCancelled;

  const buttonDisabled = isCancelled || motion?.status === MotionStatus.Pending;

  const activeIndex = stages.findIndex((stage) => stage.id === activeStageId);
  const activeStage = stages.find((stage) => stage.id === activeStageId);

  return (
    <div className={styles.mainContainer}>
      {motion?.status === MotionStatus.Pending && (
        <div className={styles.tagWrapper}>
          <Tag
            appearance={{
              theme: 'golden',
              colorSchema: 'fullColor',
            }}
            text={MSG.activeMotion}
          />
        </div>
      )}
      <div className={classNames(styles.headerContainer)}>
        <div className={styles.stagesText}>
          <FormattedMessage {...MSG.stages} />
        </div>
        <div className={styles.buttonsContainer}>
          <>
            <Button
              className={classNames(styles.iconButton, {
                [styles.iconButtonDisabled]: valueIsCopied,
              })}
              onClick={handleClipboardCopy}
              disabled={valueIsCopied}
            >
              <div className={styles.iconWrapper}>
                <Icon
                  name="share"
                  title={MSG.shareURL}
                  appearance={{ size: 'normal' }}
                  style={{ fill: styles.iconColor }}
                />
              </div>
            </Button>
            {!isCancelled && (
              <Button
                className={styles.iconButton}
                onClick={handleCancelIncorporation}
              >
                <div className={styles.iconWrapper}>
                  <Icon
                    name="trash"
                    title={MSG.deleteDraft}
                    appearance={{ size: 'normal' }}
                    style={{ fill: styles.iconColor }}
                  />
                </div>
              </Button>
            )}
            {!isCancelled && (
              <StagesButton
                activeStage={activeStage}
                buttonDisabled={buttonDisabled}
                buttonAction={buttonAction}
              />
            )}
          </>
        </div>
      </div>
      {stages.map(({ id, title, description }, index) => (
        <StageItem
          key={id}
          title={title}
          description={description}
          isActive={activeStage ? index <= activeIndex : false}
          isLast={stages.length === index + 1}
        />
      ))}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
