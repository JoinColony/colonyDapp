import React, { useEffect, useMemo, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { StageObject, ValuesType } from '~pages/IncorporationPage/types';
import {
  Motion,
  MotionStatus,
  MotionType,
  Stages as StagesEnum,
} from '~pages/IncorporationPage/constants';
import Tag from '~core/Tag';

import LinkedMotions from '../LinkedMotions';

import StageItem from './StageItem';
import StagesButton from './StagesButton';
import styles from './Stages.css';

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
  motions?: Motion[];
}

const Stages = ({
  stages,
  activeStageId,
  buttonAction,
  handleCancelIncorporation,
  motions,
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

  const isCancelled = useMemo(
    () =>
      motions?.find(
        (motionItem) =>
          motionItem.type === MotionType.Cancel &&
          motionItem.status === MotionStatus.Passed,
      ),
    [motions],
  );

  // searching for motion in pending state is a mock. Will be replaced with call to backend
  const pendingMotion = useMemo(
    () =>
      motions?.find((motionItem) => motionItem.status === MotionStatus.Pending),
    [motions],
  );

  const buttonDisabled = isCancelled || pendingMotion;

  const activeIndex = stages.findIndex((stage) => stage.id === activeStageId);
  const activeStage = stages.find((stage) => stage.id === activeStageId);

  return (
    <div className={styles.mainContainer}>
      {pendingMotion && (
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
                buttonDisabled={!!buttonDisabled}
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
      {motions && !isEmpty(motions) && <LinkedMotions motions={motions} />}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
