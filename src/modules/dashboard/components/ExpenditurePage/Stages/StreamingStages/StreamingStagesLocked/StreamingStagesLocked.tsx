import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';
import { FundingSource } from '~dashboard/ExpenditurePage/Streaming/types';

import { Motion, MotionStatus, Stage, Status } from '../../constants';

import styles from './StreamingStagesLocked.css';

const MSG = defineMessages({
  startStream: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.startStream`,
    defaultMessage: 'Start Stream',
  },
  paidToDate: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.paidToDate`,
    defaultMessage: 'Paid to date',
  },
  paidValue: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.paidValue`,
    defaultMessage: '{icon} {amount} {token}',
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
  availableToClaim: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.availableToClaim`,
    defaultMessage: 'Available to claim',
  },
  active: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.active`,
    defaultMessage: 'Active',
  },
  claimFunds: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.claimFunds`,
    defaultMessage: 'Claim funds',
  },
  startStream: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.startStream`,
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
  handleButtonClick?: () => void;
  status?: Status;
  motion?: Motion;
  colony?: Colony;
  activeStateId?: string;
  paidToDate?: FundingSource['rate'][];
  availableToClaim?: FundingSource['rate'][];
}

const StreamingStagesLocked = ({
  handleButtonClick,
  status,
  motion,
  colony,
  activeStateId,
  paidToDate,
  availableToClaim,
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

  const isCancelled =
    status === Status.Cancelled || status === Status.ForceCancelled;

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
          {status === Status.StartedStream && (
            <span className={styles.tagWrapper}>
              <Tag
                appearance={{
                  theme: 'blue',
                  colorSchema: 'fullColor',
                  fontSize: 'tiny',
                }}
                text={MSG.active}
              />
            </span>
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
              disabled={isCancelled || motion?.status === MotionStatus.Pending}
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
            {status === Status.StartedStream && availableToClaim && (
              <Button
                text={MSG.claimFunds}
                onClick={handleButtonClick}
                style={buttonStyles}
              />
            )}
          </div>
        </div>
      </FormSection>
      <div
        className={classNames(styles.stagesRow, {
          [styles.alignStart]: paidToDate && paidToDate?.length > 1,
        })}
      >
        <span className={styles.label}>
          <FormattedMessage {...MSG.paidToDate} />
        </span>
        <div className={styles.valueWrapper}>
          {status === Status.StartedStream && paidToDate ? (
            paidToDate.map((paidToDateItem, index) => {
              const token = colony?.tokens?.find(
                (tokenItem) => tokenItem.address === paidToDateItem.token,
              );

              return (
                <div
                  className={classNames(styles.value, {
                    [styles.marginBottom]:
                      paidToDate.length > 1 && index !== paidToDate.length - 1,
                  })}
                  key={paidToDateItem.id}
                >
                  <FormattedMessage
                    {...MSG.paidValue}
                    values={{
                      icon: token && (
                        <TokenIcon
                          className={styles.tokenIcon}
                          token={token}
                          name={token?.name || token?.address}
                        />
                      ),
                      amount: paidToDateItem?.amount,
                      token: token?.symbol,
                    }}
                  />
                </div>
              );
            })
          ) : (
            <FormattedMessage {...MSG.notStarted} />
          )}
        </div>
      </div>
      {activeStateId === Stage.Released &&
        availableToClaim &&
        status === Status.StartedStream && (
          <FormSection appearance={{ border: 'top' }}>
            <div
              className={classNames(styles.stagesRow, styles.borderBottom, {
                [styles.alignStart]: availableToClaim?.length > 1,
              })}
            >
              <span className={styles.label}>
                <FormattedMessage {...MSG.availableToClaim} />
              </span>
              <div className={styles.valueWrapper}>
                {availableToClaim.map((availableItem, index) => {
                  const token = colony?.tokens?.find(
                    (tokenItem) => tokenItem.address === availableItem.token,
                  );

                  return (
                    <span
                      className={classNames(styles.value, {
                        [styles.marginBottom]:
                          availableToClaim.length > 1 &&
                          index !== availableToClaim.length - 1,
                      })}
                      key={availableItem.id}
                    >
                      <FormattedMessage
                        {...MSG.paidValue}
                        values={{
                          icon: token && (
                            <TokenIcon
                              className={styles.tokenIcon}
                              token={token}
                              name={token?.name || token?.address}
                            />
                          ),
                          amount: availableItem.amount,
                          token: token?.symbol,
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </FormSection>
        )}
    </div>
  );
};

StreamingStagesLocked.displayName = displayName;

export default StreamingStagesLocked;
