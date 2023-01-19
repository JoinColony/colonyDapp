import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { StageObject, ValuesType } from '~pages/IncorporationPage/types';
import { Stages as StagesEnum } from '~pages/IncorporationPage/constants';
import { Motion } from '~pages/ExpenditurePage/types';
import {
  MotionStatus,
  MotionType,
} from '~dashboard/ExpenditurePage/Stages/constants';
import Tag from '~core/Tag';

import StageItem from './StageItem';
import StagesButton from './StagesButton';
import styles from './Stages.css';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.DAOIncorporation.Stages.stages',
    defaultMessage: 'Stages',
  },
  deleteDraft: {
    id: 'dashboard.DAOIncorporation.Stages.deleteDraft',
    defaultMessage: 'Delete draft',
  },
  tooltipDeleteText: {
    id: 'dashboard.DAOIncorporation.Stages.tooltipDeleteText',
    defaultMessage: 'Delete',
  },
  tooltipShareText: {
    id: 'dashboard.DAOIncorporation.Stages.tooltipShareText',
    defaultMessage: 'Share URL',
  },
  activeMotion: {
    id: 'dashboard.DAOIncorporation.Stages.activeMotion',
    defaultMessage: 'There is an active motion for this application',
  },
});

const displayName = 'dashboard.DAOIncorporation.Stages';

export interface Props {
  stages: StageObject[];
  activeStageId: StagesEnum;
  buttonDisabled?: boolean;
  buttonAction?: (values?: ValuesType) => void;
  motion?: Motion;
}

const Stages = ({
  stages,
  activeStageId,
  buttonDisabled,
  buttonAction,
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
          >
            {motion.type === MotionType.Edit &&
              motion.status === MotionStatus.Pending && (
                <FormattedMessage {...MSG.activeMotion} />
              )}
          </Tag>
        </div>
      )}
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
              {valueIsCopied ? (
                <Icon name="share" className={styles.icon} />
              ) : (
                <Tooltip
                  placement="top-start"
                  content={<FormattedMessage {...MSG.tooltipShareText} />}
                  popperOptions={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 12],
                        },
                      },
                    ],
                  }}
                >
                  <div className={styles.iconWrapper}>
                    <Icon name="share" className={styles.icon} />
                  </div>
                </Tooltip>
              )}
            </Button>
            <Button className={styles.iconButton}>
              <Tooltip
                placement="top-start"
                content={<FormattedMessage {...MSG.tooltipDeleteText} />}
                popperOptions={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 12],
                      },
                    },
                  ],
                }}
              >
                <div className={styles.iconWrapper}>
                  <Icon
                    name="trash"
                    title={MSG.deleteDraft}
                    appearance={{ size: 'normal' }}
                    style={{ fill: styles.iconColor }}
                  />
                </div>
              </Tooltip>
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
