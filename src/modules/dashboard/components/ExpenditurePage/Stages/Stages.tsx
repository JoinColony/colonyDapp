import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
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
    defaultMessage: `You need to be the owner to release funds. You can change the owner to transfer permission.`,
  },
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
});

const buttonStyle = {
  width: styles.buttonWidth,
  height: styles.buttonHeight,
  padding: 0,
};

const displayName = 'dashboard.ExpenditurePage.Stages';

interface ActiveState {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  buttonTooltip?: string | MessageDescriptor;
}

const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

interface Props {
  states: State[];
  handleSubmit: (values: InitialValuesType) => void;
  activeStateId?: string;
}

const Stages = ({ states, activeStateId }: Props) => {
  const { values, handleSubmit, validateForm } =
    useFormikContext<ValuesType>() || {};

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

  const activeIndex = states.findIndex((state) => state.id === activeStateId);
  const activeState = states.find((state) => state.id === activeStateId);

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
              <span className={styles.iconContainer}>
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
              </span>
              <Button onClick={handleSaveDraft} style={buttonStyles}>
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
                    <Icon name="share" className={styles.icon} />
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
                        className={styles.icon}
                        title={MSG.deleteDraft}
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
                        className={styles.icon}
                        title={MSG.deleteDraft}
                      />
                    </div>
                  </Tooltip>
                </span>
              )}
              {activeState?.buttonTooltip ? (
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
                  >
                    {typeof activeState?.buttonText === 'string' ? (
                      activeState.buttonText
                    ) : (
                      <FormattedMessage {...activeState?.buttonText} />
                    )}
                  </Button>
                </Tooltip>
              ) : (
                <Button onClick={activeState?.buttonAction} style={buttonStyle}>
                  {typeof activeState?.buttonText === 'string' ? (
                    activeState.buttonText
                  ) : (
                    <FormattedMessage {...activeState?.buttonText} />
                  )}
                </Button>
              )}
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
