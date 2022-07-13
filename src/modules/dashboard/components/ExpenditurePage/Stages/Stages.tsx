import { useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';
import classNames from 'classnames';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import DeleteDraftDialog from '../../Dialogs/DeleteDraftDialog/DeleteDraftDialog';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';
import StageItem from './StageItem';
import styles from './Stages.css';
import { Stage } from './constants';
import CancelExpenditureDialog from '~dashboard/Dialogs/CancelExpenditureDialog';
import { Colony } from '~data/index';

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
  lockValues: {
    id: 'dashboard.Expenditures.Stages.lockValues',
    defaultMessage: 'Lock values',
  },
  escrowFunds: {
    id: 'dashboard.Expenditures.Stages.escrowFunds',
    defaultMessage: 'Escrow funds',
  },
  releaseFunds: {
    id: 'dashboard.Expenditures.Stages.releaseFunds',
    defaultMessage: 'Release funds',
  },
  claim: {
    id: 'dashboard.Expenditures.Stages.claim',
    defaultMessage: 'Claim',
  },
  completed: {
    id: 'dashboard.Expenditures.Stages.completed',
    defaultMessage: 'Completed',
  },
  draft: {
    id: 'dashboard.Expenditures.Stages.draft',
    defaultMessage: 'Draft',
  },
  locked: {
    id: 'dashboard.Expenditures.Stages.locked',
    defaultMessage: 'Locked',
  },
  funded: {
    id: 'dashboard.Expenditures.Stages.funded',
    defaultMessage: 'Funded',
  },
  released: {
    id: 'dashboard.Expenditures.Stages.released',
    defaultMessage: 'Released',
  },
  claimed: {
    id: 'dashboard.Expenditures.Stages.claimed',
    defaultMessage: 'Claimed',
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
  tooltipLockValuesText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  tooltipCancelText: {
    id: 'dashboard.ExpenditurePage.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel expenditure',
  },
});

interface ActiveState {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  stage: string;
}

const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

interface Props {
  colony?: Colony;
}

const Stages = ({ colony }: Props) => {
  const [activeStateId, setActiveStateId] = useState<string | null>();
  const { resetForm } = useFormikContext() || {};
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);

  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);
  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const openCancelExpenditureDialog = useDialog(CancelExpenditureDialog);

  const handleLockExpenditure = () => {
    // Call to backend will be added here, to lock the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeState in a state
    setActiveStateId(Stage.Locked);
  };

  const states = [
    {
      id: Stage.Draft,
      label: MSG.draft,
      buttonText: MSG.lockValues,
      buttonAction: handleLockExpenditure,
      buttonTooltipt: MSG.tooltipLockValuesText,
    },
    {
      id: Stage.Locked,
      label: MSG.locked,
      buttonText: MSG.escrowFunds,
      buttonAction: () => {},
      stage: Stage.Locked,
    },
    {
      id: Stage.Funded,
      label: MSG.funded,
      buttonText: MSG.releaseFunds,
      buttonAction: () => {},
      stage: Stage.Funded,
    },
    {
      id: Stage.Released,
      label: MSG.released,
      buttonText: MSG.claim,
      buttonAction: () => {},
      stage: Stage.Released,
    },
    {
      id: Stage.Claimed,
      label: MSG.claimed,
      buttonText: MSG.completed,
      buttonAction: () => {},
      stage: Stage.Claimed,
    },
  ];

  const handleSaveDraft = () =>
    openDraftConfirmDialog({
      onClick: () => setActiveStateId(Stage.Draft),
      isVotingExtensionEnabled: true,
    });

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
    openCancelExpenditureDialog({
      onClick: () => {},
      colony,
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
                  onClick={handleCancelExpenditure}
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
              {activeState?.buttonTooltipt ? (
                <Tooltip
                  placement="top"
                  content={
                    typeof activeState.buttonTooltipt === 'string' ? (
                      <div className={styles.buttonTooltip}>
                        {activeState.buttonTooltipt}
                      </div>
                    ) : (
                      <div className={styles.buttonTooltip}>
                        <FormattedMessage {...activeState.buttonTooltipt} />
                      </div>
                    )
                  }
                >
                  <Button
                    onClick={activeState?.buttonAction}
                    style={buttonStyles}
                  >
                    {typeof activeState?.buttonText === 'string' ? (
                      activeState.buttonText
                    ) : (
                      <FormattedMessage {...activeState?.buttonText} />
                    )}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  onClick={activeState?.buttonAction}
                  style={buttonStyles}
                >
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

export default Stages;
