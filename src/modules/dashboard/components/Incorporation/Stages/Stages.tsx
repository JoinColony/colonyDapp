import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { StageObject } from '~pages/IncorporationPage/types';
import { Stages as StagesEnum } from '~pages/IncorporationPage/constants';

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
});

const displayName = 'dashboard.Incorporation.Stages';

export interface Props {
  stages: StageObject[];
  activeStageId: StagesEnum;
  buttonDisabled?: boolean;
  buttonAction?: (values?: ValuesType) => void;
  handleCancelIncorporation: VoidFunction;
}

const Stages = ({
  stages,
  activeStageId,
  buttonDisabled,
  buttonAction,
  handleCancelIncorporation,
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

  const activeIndex = stages.findIndex((stage) => stage.id === activeStageId);
  const activeStage = stages.find((stage) => stage.id === activeStageId);

  return (
    <div className={styles.mainContainer}>
      <div className={classNames(styles.statusContainer)}>
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
            <Button className={styles.iconButton} onClick={handleCancelIncorporation}>
              <div className={styles.iconWrapper}>
                <Icon
                  name="trash"
                  title={MSG.deleteDraft}
                  appearance={{ size: 'normal' }}
                  style={{ fill: styles.iconColor }}
                />
              </div>
            </Button>
            <StagesButton
              activeStage={activeStage}
              buttonDisabled={buttonDisabled}
              buttonAction={buttonAction}
            />
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
