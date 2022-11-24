import React, { useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';
import { isEmpty } from 'lodash';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';
import {
  FundingSource,
  Rate,
} from '~dashboard/ExpenditurePage/Streaming/types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';
import { INSUFFICIENT_FUNDS_EVENT_TRIGGER } from '~pages/ExpenditurePage/constants';

import {
  Motion,
  MotionStatus,
  MotionType,
  Stage,
  Status,
} from '../../constants';

import { useClaimStreamingPayment } from './hooks';
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
  ended: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.ended`,
    defaultMessage: 'Ended',
  },
  claimed: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStage.StreamingStagesLocked.claimed`,
    defaultMessage: 'Claimed',
  },
  cancelled: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.cancelled`,
    defaultMessage: 'Cancelled',
  },
  errorMessage: {
    id: `dashboard.ExpenditurePage.Stages.StreamingStages.StreamingStagesLocked.errorMessage`,
    defaultMessage: `Insufficient funds in team. Ensure {teamCount, plural, one {team is} other {all teams are}} funded.`,
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
  activeStageId?: string;
  paidToDate?: Rate[];
  availableToClaim?: Rate[];
  handleCancelExpenditure?: () => void;
  claimed?: boolean;
  fundingSources?: FundingSource[];
}

const StreamingStagesLocked = ({
  status,
  motion,
  colony,
  activeStageId,
  handleCancelExpenditure,
  fundingSources,
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const [hasInsufficentFunds, setHasInsufficentFunds] = useState<boolean>(
    false,
  );
  const [tokensWithError, setTokensWithError] = useState<string[]>();
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

  /* This is a mocked claiming function - should to be replaced with a call to the backend */
  const {
    availableToClaim,
    paidToDate,
    claimFunds,
    claimed,
    insufficientFunds,
  } = useClaimStreamingPayment({
    fundingSources,
    colony,
  });

  const isCancelled =
    status === Status.Cancelled || status === Status.ForceCancelled;

  const setInsufficentFunds = useCallback(() => {
    setHasInsufficentFunds(true);
    setTokensWithError(insufficientFunds?.tokens);

    const customEvent = new CustomEvent(INSUFFICIENT_FUNDS_EVENT_TRIGGER, {
      detail: {
        fundingSources: insufficientFunds?.fundingSources,
        tokens: insufficientFunds?.tokens,
      },
    });

    window.dispatchEvent(customEvent);
  }, [insufficientFunds]);

  const handleClaimFunds = useCallback(() => {
    claimFunds();

    if (
      !insufficientFunds ||
      (isEmpty(insufficientFunds?.fundingSources) &&
        isEmpty(insufficientFunds?.tokens))
    ) {
      setHasInsufficentFunds(false);
      setTokensWithError(undefined);
    } else {
      setInsufficentFunds();
    }
  }, [claimFunds, insufficientFunds, setInsufficentFunds]);

  return (
    <div className={styles.stagesWrapper}>
      {hasInsufficentFunds && (
        <div className={styles.stagesMsg}>
          <p className={styles.stagesMsgText}>
            <FormattedMessage
              {...MSG.errorMessage}
              values={{ teamCount: fundingSources?.length || 0 }}
            />
          </p>
        </div>
      )}
      <FormSection appearance={{ border: 'bottom' }}>
        <div
          className={classNames(
            styles.stagesRow,
            styles.paddingTopZero,
            styles.headerRow,
          )}
        >
          {motion?.status === MotionStatus.Pending && (
            <div
              className={classNames(styles.tag, {
                [styles.fullWidth]: motion?.type !== MotionType.StartStream,
              })}
            >
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
            </div>
          )}
          {(status === Status.StartedStream || status === Status.Edited) && (
            <span
              className={classNames(styles.tagWrapper, {
                [styles.tagClaimed]: claimed || status === Status.Edited,
              })}
            >
              <Tag
                appearance={{
                  theme: 'blue',
                  colorSchema: 'fullColor',
                  fontSize: 'tiny',
                }}
                text={claimed ? MSG.ended : MSG.active}
              />
            </span>
          )}
          {status === Status.Cancelled && (
            <span className={classNames(styles.tagWrapper, styles.cancelled)}>
              <Tag
                appearance={{
                  theme: 'pink',
                  colorSchema: 'fullColor',
                  fontSize: 'tiny',
                }}
                text={MSG.cancelled}
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
                [styles.cancelIcon]:
                  motion?.status !== MotionStatus.Pending || isCancelled,
                [styles.iconButtonDisabled]:
                  motion?.status === MotionStatus.Pending || isCancelled,
              })}
              onClick={handleCancelExpenditure}
              disabled={isCancelled || motion?.status === MotionStatus.Pending}
            >
              {motion?.status === MotionStatus.Pending || isCancelled ? (
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
                  onClick={handleClaimFunds}
                  style={buttonStyles}
                  disabled={claimed || hasInsufficentFunds}
                />
              )}
            {(status === Status.StartedStream || status === Status.Cancelled) &&
              availableToClaim && (
                <Button
                  text={MSG.claimFunds}
                  onClick={handleClaimFunds}
                  style={buttonStyles}
                  disabled={claimed}
                />
              )}
          </div>
        </div>
      </FormSection>
      <div className={styles.gridContainer}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.paidToDate} />
        </div>
        <div className={styles.valueWrapper}>
          {(status === Status.StartedStream || isCancelled) &&
          paidToDate &&
          !isEmpty(paidToDate) ? (
            paidToDate.map((paidToDateItem) => {
              const token = colony?.tokens?.find(
                (tokenItem) => tokenItem.address === paidToDateItem.token,
              );

              if (!token) {
                return null;
              }

              return (
                <div className={styles.value} key={paidToDateItem.id}>
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
                      amount: paidToDateItem.amount && (
                        <Numeral
                          unit={getTokenDecimalsWithFallback(0)} // 0 is a mock
                          value={paidToDateItem.amount}
                        />
                      ),
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
        <hr className={styles.border} />
        <hr className={styles.border} />
        {activeStageId === Stage.Released && availableToClaim && (
          <>
            <div className={styles.label}>
              <FormattedMessage {...MSG.availableToClaim} />
            </div>
            <div className={styles.valueWrapper}>
              {availableToClaim.map((availableItem) => {
                const token = colony?.tokens?.find(
                  (tokenItem) => tokenItem.address === availableItem.token,
                );
                if (!token) {
                  return null;
                }

                return (
                  <span
                    className={classNames(styles.value, {
                      [styles.error]:
                        hasInsufficentFunds &&
                        tokensWithError?.find(
                          (tokenAddress) => tokenAddress === token.id,
                        ),
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
                        amount: availableItem.amount && (
                          <Numeral
                            unit={getTokenDecimalsWithFallback(0)} // 0 is a mock
                            value={availableItem.amount}
                          />
                        ),
                        token: token?.symbol,
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

StreamingStagesLocked.displayName = displayName;

export default StreamingStagesLocked;
