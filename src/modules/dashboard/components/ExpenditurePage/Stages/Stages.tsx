import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useFormikContext } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';
import { ColonyRole } from '@colony/colony-js';

import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';
import { Colony } from '~data/index';
import CancelExpenditureDialog from '~dashboard/Dialogs/CancelExpenditureDialog';
import PermissionsLabel from '~core/PermissionsLabel';
import Tag from '~core/Tag';

import DeleteDraftDialog from '../../Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';
import { Recipient as RecipientType } from '../Payments/types';

import StageItem from './StageItem';
import { MotionStatus, MotionType, Stage, Status } from './constants';
import LinkedMotions from './LinkedMotions/LinkedMotions';
import ClaimFunds from './ClaimFunds';
import styles from './Stages.css';

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
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
  tooltipNoPermissionToRealese: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipNoPermissionToRealese',
    defaultMessage: 'You need to create a Motion to release funds.',
  },
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages';

export const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

interface Motion {
  type: MotionType;
  status: MotionStatus;
}

interface Props {
  states: State[];
  activeStateId?: string;
  colony: Colony;
  recipients?: RecipientType[];
  status?: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status | undefined>>;
}

const Stages = ({
  colony,
  states,
  activeStateId,
  recipients,
  status,
  setStatus,
}: Props) => {
  const { values, handleSubmit, validateForm, resetForm } =
    useFormikContext<ValuesType>() || {};
  const { formatMessage } = useIntl();

  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);
  const [motion, setMotion] = useState<Motion>();

  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const openCancelExpenditureDialog = useDialog(CancelExpenditureDialog);

  const handleSaveDraft = useCallback(async () => {
    const errors = await validateForm(values);
    const hasErrors = Object.keys(errors)?.length;

    return (
      !hasErrors &&
      openDraftConfirmDialog({
        onClick: () => {
          handleSubmit(values as any);
        },
        isVotingExtensionEnabled: true,
      })
    );
  }, [handleSubmit, openDraftConfirmDialog, validateForm, values]);

  const handleDeleteDraft = () =>
    openDeleteDraftDialog({
      onClick: () => {
        resetForm?.();
        if (activeStateId === Stage.Draft) {
          // add logic to delete the draft from database
        }
      },
    });

  const handleCancelExpenditure = () =>
    colony &&
    openCancelExpenditureDialog({
      onCancelExpenditure: (isForce: boolean) => {
        if (isForce) {
          // temporary action
          setStatus(Status.ForceCancelled);
        } else {
          // setTimeout is temporary, call to backend should be added here
          setMotion({ type: MotionType.Cancel, status: MotionStatus.Pending });
          setTimeout(() => {
            setStatus(Status.Cancelled);
            setMotion({ type: MotionType.Cancel, status: MotionStatus.Passed });
          }, 5000);
        }
      },
      colony,
      isVotingExtensionEnabled: true, // temporary value
    });

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
            onClick={activeState?.buttonAction}
            style={buttonStyles}
            disabled={activeStateId === Stage.Claimed}
          >
            {buttonText}
          </Button>
        </Tooltip>
      );
    }

    return (
      <Button onClick={activeState?.buttonAction} style={buttonStyles}>
        {buttonText}
      </Button>
    );
  }, [activeState, activeStateId, canRealeseFounds, formatMessage, status]);

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

      // if forced cancellation - it shows different label with icon
      if (status === Status.ForceCancelled && index === activeIndex) {
        return (
          <div className={styles.labelComponent}>
            {typeof label === 'object' && label?.id ? (
              <FormattedMessage {...label} />
            ) : (
              label
            )}{' '}
            ({formatMessage(MSG.cancelled).toLocaleLowerCase()})
            <PermissionsLabel
              permission={role}
              appearance={{ theme: 'white' }}
              minimal
            />
          </div>
        );
      }

      // if forced cancellation - it shows different label
      if (status === Status.Cancelled && index === activeIndex) {
        return (
          <div className={styles.labelComponent}>
            {typeof label === 'object' && label?.id ? (
              <FormattedMessage {...label} />
            ) : (
              label
            )}{' '}
            ({formatMessage(MSG.cancelled).toLocaleLowerCase()})
          </div>
        );
      }

      return undefined;
    },
    [activeIndex, formatMessage, status],
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
      {motion && (
        <LinkedMotions
          status={motion.status}
          motion={motion.type}
          id="25"
          motionLink={LANDING_PAGE_ROUTE}
        />
      )}
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
