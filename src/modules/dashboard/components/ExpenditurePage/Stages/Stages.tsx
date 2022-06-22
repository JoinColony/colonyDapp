import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import DeleteDraftDialog from './DeleteDraftDialog';
import styles from './Stages.css';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';
import StageItem from './StageItem';
import { Stage } from './constants';
import LinkedMotions from './LinkedMotions';
import {
  InitialValuesType,
  State,
  ValuesType,
} from '~pages/ExpenditurePage/ExpenditurePage';
import ClaimFunds from './ClaimFunds';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.Expenditures.Stages.stages',
    defaultMessage: 'Stages',
  },
  notSaved: {
    id: 'dashboard.Expenditures.Stages.notSaved',
    defaultMessage: 'Not saved',
  },
  submitDraft: {
    id: 'dashboard.Expenditures.Stages.submitDraft',
    defaultMessage: 'Submit draft',
  },
  deleteDraft: {
    id: 'dashboard.Expenditures.Stages.deleteDraft',
    defaultMessage: 'Delete draft',
  },
  tooltipDeleteText: {
    id: 'dashboard.Expenditures.Stages.tooltipDeleteText',
    defaultMessage: 'Delete the expenditure',
  },
  tooltipShareText: {
    id: 'dashboard.Expenditures.Stages.tooltipShareText',
    defaultMessage: 'Share expenditure URL',
  },
  tooltipCancelText: {
    id: 'dashboard.Expenditures.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel expenditure',
  },
  tooltipNoPermissionToRealese: {
    id: 'dashboard.Expenditures.Stages.tooltipNoPermissionToRealese',
    defaultMessage: `You need to be the owner to release funds. You can change the owner to transfer permission.`,
  },
});

export const buttonStyle = {
  width: styles.buttonWidth,
  height: styles.buttonHeight,
  padding: 0,
};

interface Props {
  states: State[];
  handleSubmit: (values: InitialValuesType) => void;
  activeStateId?: string;
}

const Stages = ({ states, activeStateId }: Props) => {
  const { values, resetForm, handleSubmit, validateForm } =
    useFormikContext<ValuesType>() || {};

  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);

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
          // logic to delete a draft from database
        }
      },
    });

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
            <Button onClick={activeState?.buttonAction} style={buttonStyle}>
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
                  style={buttonStyle}
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
              style={buttonStyle}
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
        style={buttonStyle}
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
          // temporary value
          buttonIsActive
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
                <span className={styles.iconContainer}>
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
                </span>
                <Button
                  onClick={handleSaveDraft}
                  style={{ height: styles.buttonHeight }}
                >
                  <FormattedMessage {...MSG.submitDraft} />
                </Button>
              </>
            ) : (
              <>
                <span className={styles.iconContainer}>
                  <Tooltip
                    placement="top-start"
                    content={<FormattedMessage {...MSG.tooltipShareText} />}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon
                        name="share"
                        appearance={{ size: 'normal' }}
                        style={{ fill: styles.iconColor }}
                      />
                    </div>
                  </Tooltip>
                </span>
                {activeStateId === Stage.Draft && (
                  <span className={styles.iconContainer}>
                    <Tooltip
                      placement="top-start"
                      content={<FormattedMessage {...MSG.tooltipDeleteText} />}
                    >
                      <div className={styles.iconWrapper}>
                        <Icon
                          name="trash"
                          onClick={handleDeleteDraft}
                          title={MSG.deleteDraft}
                          appearance={{ size: 'normal' }}
                          style={{ fill: styles.iconColor }}
                        />
                      </div>
                    </Tooltip>
                  </span>
                )}
                {activeStateId !== Stage.Draft && (
                  <span
                    className={classNames(
                      styles.iconContainer,
                      styles.cancelIcon,
                    )}
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
                  </span>
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
        <LinkedMotions status="passed" />
      </div>
    </div>
  );
};

export default Stages;
