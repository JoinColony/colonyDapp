import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';

import { Motion, MotionStatus, Status } from '../../constants';

import styles from './StreamingStagesLocked.css';

const MSG = defineMessages({
  paidToDate: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.paidToDate`,
    defaultMessage: 'Paid to date',
  },
  activeMotion: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.activeMotion`,
    defaultMessage: 'There is an active motion for this stream',
  },
  tooltipCancelText: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.tooltipCancelText`,
    defaultMessage: 'Click to cancel expenditure',
  },
  tooltipShareText: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.tooltipShareText`,
    defaultMessage: 'Share expenditure URL',
  },
  notStarted: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.notStarted`,
    defaultMessage: 'Not started',
  },
  claimFunds: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.claimFunds`,
    defaultMessage: 'Claim funds',
  },
  startStream: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.startStream`,
    defaultMessage: 'Start Stream',
  },
});

const displayName =
  'dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Props {
  motion?: Motion;
  status?: Status;
  handleButtonClick?: () => void;
}

const StreamingStagesLocked = ({
  motion,
  status,
  handleButtonClick,
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);
  const { formatMessage } = useIntl();

  const handleClipboardCopy = () => {
    copyToClipboard(window.location.href);
    setValueIsCopied(true);
    userFeedbackTimer.current = setTimeout(() => setValueIsCopied(false), 2000);
  };

  useEffect(() => () => clearTimeout(userFeedbackTimer.current), [
    userFeedbackTimer,
  ]);

  const handleCancelExpenditure = () => {
    // add cancel modal in next PR
  };

  return (
    <div className={styles.stagesWrapper}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={classNames(styles.stagesRow, styles.paddingTopZero)}>
          {motion?.status === MotionStatus.Pending && (
            <Tag
              appearance={{
                theme: 'golden',
                colorSchema: 'fullColor',
              }}
            >
              <span className={styles.motionText}>
                {formatMessage(MSG.activeMotion)}
              </span>
            </Tag>
          )}
          <div className={styles.buttonsWrapper}>
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
                          offset: [0, 14],
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
            <Button
              className={classNames(styles.iconButton, {
                [styles.cancelIcon]: motion?.status !== MotionStatus.Pending,
                [styles.iconButtonDisabled]:
                  motion?.status === MotionStatus.Pending,
              })}
              onClick={handleCancelExpenditure}
              disabled={motion?.status === MotionStatus.Pending}
            >
              {motion?.status === MotionStatus.Pending ? (
                <Icon
                  name="circle-minus"
                  appearance={{ size: 'normal' }}
                  style={{ fill: styles.iconColor }}
                />
              ) : (
                <Tooltip
                  placement="top-start"
                  content={<FormattedMessage {...MSG.tooltipCancelText} />}
                  popperOptions={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 14],
                        },
                      },
                    ],
                  }}
                >
                  <div className={styles.iconWrapper}>
                    <Icon
                      name="circle-minus"
                      appearance={{ size: 'normal' }}
                      style={{ fill: styles.iconColor }}
                    />
                  </div>
                </Tooltip>
              )}
            </Button>
            {motion?.status !== MotionStatus.Pending &&
              status !== Status.StartedStream &&
              status !== Status.Cancelled && (
                <Button
                  text={MSG.startStream}
                  onClick={handleButtonClick}
                  style={buttonStyles}
                />
              )}
          </div>
        </div>
      </FormSection>
      <div className={styles.stagesRow}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.paidToDate} />
        </span>
        <div className={styles.valueWrapper}>
          <FormattedMessage {...MSG.notStarted} />
        </div>
      </div>
    </div>
  );
};

StreamingStagesLocked.displayName = displayName;

export default StreamingStagesLocked;
