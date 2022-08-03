import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { Colony } from '~data/index';
import Tag from '~core/Tag';

import DeleteDraftDialog from '../../Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';

import { Recipient as RecipientType } from '../Payments/types';

import { Stage } from './constants';
import ClaimFunds from './ClaimFunds';
import StageItem from './StageItem';
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
  activeStateId?: string;
  recipients?: RecipientType[];
  colony?: Colony;
}

const Stages = ({ states, activeStateId, recipients, colony }: Props) => {
  const { values, handleSubmit, validateForm, resetForm } =
    useFormikContext<ValuesType>() || {};
  const { formatMessage } = useIntl();

  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

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
  const canRealeseFounds = false;
  const isLogedIn = true;

  const renderButton = useCallback(() => {
    const buttonText =
      typeof activeState?.buttonText === 'string'
        ? activeState.buttonText
        : activeState?.buttonText && formatMessage(activeState.buttonText);

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
  }, [activeState, activeStateId, canRealeseFounds, formatMessage]);

  return (
    <div className={styles.mainContainer}>
      {isLogedIn && activeStateId === Stage.Released && (
        <ClaimFunds
          recipients={recipients}
          colony={colony}
          buttonAction={activeState?.buttonAction}
          buttonText={activeState?.buttonText}
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
                {activeStateId !== Stage.Draft &&
                  activeStateId !== Stage.Claimed && (
                    <Button
                      className={classNames(
                        styles.iconButton,
                        styles.cancelIcon,
                      )}
                      onClick={() => {}}
                    >
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
