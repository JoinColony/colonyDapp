import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { ExpenditureTypes } from '~pages/ExpenditurePage/types';
import Tag from '~core/Tag';

import DeleteDraftDialog from '../../Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';

import StageItem from './StageItem';
import { Stage } from './constants';
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

const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

interface Props {
  states: State[];
  activeStateId?: string;
  formValues?: ValuesType;
}

const Stages = ({ states, activeStateId, formValues }: Props) => {
  const { values, handleSubmit, errors, dirty, resetForm } =
    useFormikContext<ValuesType>() || {};
  const { formatMessage } = useIntl();

  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const handleSaveDraft = useCallback(async () => {
    return (
      isEmpty(errors) &&
      openDraftConfirmDialog({
        onClick: () => {
          handleSubmit(values as any);
        },
        isVotingExtensionEnabled: true,
      })
    );
  }, [errors, handleSubmit, openDraftConfirmDialog, values]);

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

  const renderButton = useCallback(() => {
    const buttonText =
      typeof activeState?.buttonText === 'string'
        ? activeState.buttonText
        : activeState?.buttonText && formatMessage(activeState.buttonText);

    if (activeStateId === Stage.Claimed) {
      return <Tag text={buttonText} className={styles.claimed} />;
    }
    if (
      activeStateId === Stage.Funded &&
      formValues?.expenditure === ExpenditureTypes.Staged
    ) {
      return null;
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
  }, [activeState, activeStateId, formatMessage, formValues]);

  return (
    <div className={styles.mainContainer}>
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
              <Button
                onClick={handleSaveDraft}
                style={buttonStyles}
                disabled={!isEmpty(errors) || !dirty}
              >
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
                        className={styles.icon}
                        onClick={handleDeleteDraft}
                        title={MSG.deleteDraft}
                      />
                    </div>
                  </Tooltip>
                </Button>
              )}
              {activeStateId !== Stage.Draft && (
                <Button
                  className={classNames(styles.iconButton, styles.cancelIcon)}
                  onClick={handleDeleteDraft}
                >
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipCancelText} />}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon
                        name="circle-minus"
                        className={styles.icon}
                        title={MSG.deleteDraft}
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
  );
};

Stages.displayName = displayName;

export default Stages;
