import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import PermissionsLabel from '~core/PermissionsLabel';
import Tag from '~core/Tag';

import StageItem from './StageItem';
import { Motion, MotionStatus, Stage, Status } from './constants';
import ClaimFunds from './ClaimFunds';
import styles from './Stages.css';
import { State } from '~pages/ExpenditurePage/types';
import { Recipient } from '../Payments/types';
import { Colony } from '~data/index';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.ExpenditurePage.Stages.stages',
    defaultMessage: 'Stages',
  },
  notSaved: {
    id: 'dashboard.ExpenditurePage.Stages.notSaved',
    defaultMessage: 'Not saved',
  },
  submitDraft: {
    id: 'dashboard.ExpenditurePage.Stages.submitDraft',
    defaultMessage: 'Submit draft',
  },
  deleteDraft: {
    id: 'dashboard.ExpenditurePage.Stages.deleteDraft',
    defaultMessage: 'Delete draft',
  },
  tooltipDeleteText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipDeleteText',
    defaultMessage: 'Delete the expenditure',
  },
  tooltipShareText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipShareText',
    defaultMessage: 'Share expenditure URL',
  },
  tooltipCancelText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel expenditure',
  },
  cancelled: {
    id: 'dashboard.ExpenditurePage.Stages.cancelled',
    defaultMessage: 'Cancelled',
  },
  tooltipNoPermissionToRealese: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipNoPermissionToRealese',
    defaultMessage: 'You need to create a Motion to release funds.',
  },
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  tooltipForcedUpdate: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipForcedUpdate',
    defaultMessage: 'Value updated by arbitrator',
  },
  updatedByArbitrator: {
    id: 'dashboard.ExpenditurePage.Stages.updatedByArbitrator',
    defaultMessage: 'Value updated by arbitrator',
  },
  label: {
    id: 'dashboard.ExpenditurePage.Stages.label',
    defaultMessage: '{label} {icon}',
  },
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

export interface Props {
  states: State[];
  activeStateId?: string;
  handleDeleteDraft?: () => void;
  handleSaveDraft?: () => void;
  handleButtonClick: () => void;
  status?: Status;
  motion?: Motion;
  handleCancelExpenditure?: () => void;
  recipients?: Recipient[];
  colony: Colony;
}

const Stages = ({
  states,
  activeStateId,
  handleDeleteDraft,
  handleSaveDraft,
  handleButtonClick,
  status,
  motion,
  handleCancelExpenditure,
  recipients,
  colony,
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

  const activeIndex = states.findIndex((state) => state.id === activeStateId);
  const activeState = states.find((state) => state.id === activeStateId);
  // temporary value, there's need to add logic to check if realese founds can be made
  const canRealeseFounds = true;
  const isLogedIn = true;

  const renderButton = useCallback(() => {
    const buttonText =
      typeof activeState?.buttonText === 'string'
        ? activeState.buttonText
        : activeState?.buttonText && formatMessage(activeState.buttonText);

    if (status === Status.Cancelled || status === Status.ForceCancelled) {
      return <Tag text={MSG.cancelled} className={styles.claimed} />;
    }
    if (activeStateId === Stage.Claimed) {
      return <Tag text={buttonText} className={styles.claimed} />;
    }

    if (activeStateId === Stage.Claimed) {
      return <Tag text={buttonText} className={styles.claimed} />;
    }
    if (activeStateId === Stage.Released) {
      return null;
    }
    if (activeStateId === Stage.Funded) {
      return (
        <>
          {canRealeseFounds ? (
            <Button onClick={activeState?.buttonAction} style={buttonStyles}>
              {buttonText}
            </Button>
          ) : (
            <Tooltip
              placement="top"
              isOpen
              content={
                <div className={styles.buttonTooltip}>
                  <FormattedMessage {...MSG.tooltipNoPermissionToRealese} />
                </div>
              }
            >
              <Button
                onClick={activeState?.buttonAction}
                style={buttonStyles}
                disabled
              >
                {buttonText}
              </Button>
            </Tooltip>
          )}
        </>
      );
    }
    if (activeState?.buttonTooltip) {
      return (
        <Tooltip
          placement="top"
          content={
            <div className={styles.buttonTooltip}>
              {typeof activeState.buttonTooltip === 'string'
                ? activeState.buttonTooltip
                : formatMessage(activeState.buttonTooltip)}
            </div>
          }
        >
          <Button
            onClick={handleButtonClick}
            style={buttonStyles}
            disabled={
              activeStateId === Stage.Claimed ||
              motion?.status === MotionStatus.Pending
            }
          >
            {buttonText}
          </Button>
        </Tooltip>
      );
    }

    return (
      <Button
        onClick={handleButtonClick}
        style={buttonStyles}
        disabled={
          activeStateId === Stage.Claimed ||
          motion?.status === MotionStatus.Pending
        }
        type="submit"
      >
        {buttonText}
      </Button>
    );
  }, [
    activeState,
    activeStateId,
    canRealeseFounds,
    formatMessage,
    handleButtonClick,
    motion,
    status,
  ]);

  const labelComponent = useMemo(
    () => ({
      label,
      index,
    }: {
      label: string | MessageDescriptor;
      index: number;
    }) => {
      // role is temporary mock value
      const role = ColonyRole.Arbitration;

      if (status === Status.ForceEdited && index === activeIndex) {
        return (
          <div className={styles.labelComponent}>
            <FormattedMessage
              {...MSG.label}
              values={{
                label:
                  typeof label === 'object' && label?.id ? (
                    <FormattedMessage {...label} />
                  ) : (
                    label
                  ),
                icon: (
                  <PermissionsLabel
                    permission={role}
                    appearance={{ theme: 'white' }}
                    infoMessage={MSG.updatedByArbitrator}
                    minimal
                  />
                ),
              }}
            />
          </div>
        );
      }

      return undefined;
    },
    [activeIndex, status],
  );

  const isCancelled =
    status === Status.Cancelled || status === Status.ForceCancelled;

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
    <div className={styles.mainContainer}>
      {motion?.status === MotionStatus.Pending && (
        <div className={styles.tagWrapper}>
          <Tag
            appearance={{
              theme: 'golden',
              colorSchema: 'fullColor',
            }}
          >
            {formatMessage(MSG.motion, {
              action: formattedLabel(activeState?.buttonText),
            })}
          </Tag>
        </div>
      )}
      {isLogedIn &&
        activeStateId === Stage.Released &&
        status !== Status.Cancelled && (
          <ClaimFunds
            recipients={recipients}
            colony={colony}
            buttonAction={activeState?.buttonAction}
            buttonText={activeState?.buttonText}
            isDisabled={motion?.status === MotionStatus.Pending}
          />
        )}
      <div
        className={classNames(styles.statusContainer, {
          [styles.withTag]: motion?.status === MotionStatus.Pending,
        })}
      >
        <div className={styles.stagesText}>
          <span className={styles.status}>
            <FormattedMessage {...MSG.stages} />
          </span>
          {!activeStateId && (
            <span className={styles.notSaved}>
              <FormattedMessage {...MSG.notSaved} />
            </span>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          {!activeStateId ? (
            <>
              <Button className={styles.iconButton} onClick={handleDeleteDraft}>
                <Tooltip
                  placement="top-start"
                  content={<FormattedMessage {...MSG.tooltipDeleteText} />}
                >
                  <div className={styles.iconWrapper}>
                    <Icon
                      name="trash"
                      className={styles.icon}
                      title={MSG.deleteDraft}
                    />
                  </div>
                </Tooltip>
              </Button>
              <Button onClick={handleSaveDraft} style={buttonStyles}>
                <FormattedMessage {...MSG.submitDraft} />
              </Button>
            </>
          ) : (
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
                  >
                    <div className={styles.iconWrapper}>
                      <Icon name="share" className={styles.icon} />
                    </div>
                  </Tooltip>
                )}
              </Button>
              {!isCancelled && activeStateId === Stage.Draft && (
                <Button
                  className={styles.iconButton}
                  onClick={handleDeleteDraft}
                >
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipDeleteText} />}
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
              )}
              {!isCancelled &&
                activeStateId !== Stage.Draft &&
                activeStateId !== Stage.Claimed && (
                  <Button
                    className={classNames(styles.iconButton, {
                      [styles.cancelIcon]:
                        motion?.status !== MotionStatus.Pending,
                      [styles.iconButtonDisabled]:
                        motion?.status === MotionStatus.Pending,
                    })}
                    onClick={handleCancelExpenditure}
                    disabled={
                      isCancelled || motion?.status === MotionStatus.Pending
                    }
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
                        content={
                          <FormattedMessage {...MSG.tooltipCancelText} />
                        }
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
                )}
              {renderButton()}
            </>
          )}
        </div>
      </div>
      {states.map(({ id, label }, index) => (
        <StageItem
          key={id}
          label={label}
          isFirst={index === 0}
          isActive={activeState ? index <= activeIndex : false}
          isCancelled={isCancelled && status === Status.ForceCancelled}
          labelComponent={labelComponent({ label, index })}
        />
      ))}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
