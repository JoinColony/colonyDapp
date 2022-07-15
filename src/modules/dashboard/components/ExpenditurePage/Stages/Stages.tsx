import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useFormikContext } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';

import styles from './Stages.css';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';
import StageItem from './StageItem';
import {
  InitialValuesType,
  State,
  ValuesType,
} from '~pages/ExpenditurePage/ExpenditurePage';
import { Stage } from './constants';
import ClaimFunds from './ClaimFunds';
import { Recipient, Recipient as RecipientType } from '../Payments/types';
import { getRecipientTokens } from '../utils';
import { Colony } from '~data/index';
import { useCalculateTokens } from '../hooks';
import DeleteDraftDialog from '~dashboard/Dialogs/DeleteDraftDialog/DeleteDraftDialog';

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

interface Props {
  states: State[];
  handleSubmit: (values: InitialValuesType) => void;
  activeStateId?: string;
  recipients?: RecipientType[];
  colony?: Colony;
}

const Stages = ({ states, activeStateId, recipients, colony }: Props) => {
  const { values, handleSubmit, validateForm, resetForm } =
    useFormikContext<ValuesType>() || {};

  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const recipientsWithTokens = useMemo(() => {
    return recipients?.map((recipient) => {
      const token = getRecipientTokens(recipient, colony);
      return { ...recipient, value: token };
    });
  }, [colony, recipients]);

  const {
    claimableNow,
    claimed,
    totalClaimable,
    nextClaim,
    buttonIsActive,
  } = useCalculateTokens(recipientsWithTokens as Recipient[]);

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
    if (activeStateId === Stage.Released) {
      return null;
    }
    if (activeStateId === Stage.Funded) {
      return (
        <>
          {canRealeseFounds ? (
            <Button onClick={activeState?.buttonAction} style={buttonStyles}>
              {typeof activeState?.buttonText === 'string' ? (
                activeState.buttonText
              ) : (
                <FormattedMessage {...activeState?.buttonText} />
              )}
            </Button>
          ) : (
            <div>
              <Tooltip
                placement="top"
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
                  {typeof activeState?.buttonText === 'string' ? (
                    activeState.buttonText
                  ) : (
                    <FormattedMessage {...activeState?.buttonText} />
                  )}
                </Button>
              </Tooltip>
            </div>
          )}
        </>
      );
    }
    if (activeState?.buttonTooltip) {
      return (
        <div>
          <Tooltip
            placement="top"
            content={
              typeof activeState.buttonTooltip === 'string' ? (
                <div className={styles.buttonTooltip}>
                  {activeState.buttonTooltip}
                </div>
              ) : (
                <div className={styles.buttonTooltip}>
                  <FormattedMessage {...activeState.buttonTooltip} />
                </div>
              )
            }
          >
            <Button
              onClick={activeState?.buttonAction}
              style={buttonStyles}
              disabled={activeStateId === Stage.Claimed}
            >
              {typeof activeState?.buttonText === 'string' ? (
                activeState.buttonText
              ) : (
                <FormattedMessage {...activeState?.buttonText} />
              )}
            </Button>
          </Tooltip>
        </div>
      );
    }

    return (
      <Button
        onClick={activeState?.buttonAction}
        style={buttonStyles}
        disabled={activeStateId === Stage.Claimed}
      >
        {typeof activeState?.buttonText === 'string' ? (
          activeState.buttonText
        ) : (
          <FormattedMessage {...activeState?.buttonText} />
        )}
      </Button>
    );
  }, [activeState, activeStateId, canRealeseFounds]);

  return (
    <div className={styles.mainContainer}>
      {isLogedIn && activeStateId === Stage.Released && (
        <ClaimFunds
          buttonAction={activeState?.buttonAction}
          buttonText={activeState?.buttonText}
          buttonIsActive={buttonIsActive}
          claimableNow={claimableNow}
          claimed={claimed}
          totalClaimable={totalClaimable}
          claimDate={nextClaim}
        />
      )}
      <div className={styles.stagesContainer}>
        <div className={styles.statusContainer}>
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
                {activeStateId === Stage.Draft && (
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
                          onClick={handleDeleteDraft}
                          appearance={{ size: 'normal' }}
                          style={{ fill: styles.iconColor }}
                        />
                      </div>
                    </Tooltip>
                  </Button>
                )}
                {activeStateId !== Stage.Draft && (
                  <Button
                    className={classNames(styles.iconButton, styles.cancelIcon)}
                    onClick={() => {}}
                  >
                    <Tooltip
                      placement="top-start"
                      content={<FormattedMessage {...MSG.tooltipCancelText} />}
                    >
                      <div className={styles.iconWrapper}>
                        <Icon
                          name="circle-minus"
                          appearance={{ size: 'normal' }}
                          style={{ fill: styles.iconColor }}
                        />
                      </div>
                    </Tooltip>
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
          />
        ))}
      </div>
    </div>
  );
};

Stages.displayName = displayName;

export default Stages;
