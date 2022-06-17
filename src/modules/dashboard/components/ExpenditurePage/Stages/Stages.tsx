import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import StakeExpenditureDialog from './StakeExpenditureDialog';
import { Tooltip } from '~core/Popover';
import { Stage } from './consts';
import DeleteDraftDialog from './DeleteDraftDialog';
import StageItem from './StageItem';

import styles from './Stages.css';
import LinkedMotions from './LinkedMotions';

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
  tooltipCancelText: {
    id: 'dashboard.Expenditures.Stages.tooltipCancelText',
    defaultMessage: 'Click to cancel expenditure',
  },
  tooltipLockValuesText: {
    id: 'dashboard.Expenditures.Stages.tooltipLockValuesText',
    defaultMessage: `This will lock the values of the expenditure. To change values after locking will require the right permissions or a motion.`,
  },
  tooltipNoPermissionToRealese: {
    id: 'dashboard.Expenditures.Stages.tooltipNoPermissionToRealese',
    defaultMessage: `You need to be the owner to release funds. You can change the owner to transfer permission.`,
  },
});

const buttonStyle = {
  width: styles.buttonWidth,
  height: styles.buttonHeight,
  padding: 0,
};

interface ActiveState {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  buttonTooltip?: string | MessageDescriptor;
}

const Stages = () => {
  const [activeStateId, setActiveStateId] = useState<string | null>(null);
  const { resetForm } = useFormikContext() || {};

  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);
  const openDeleteDraftDialog = useDialog(DeleteDraftDialog);

  const handleLockExpenditure = () => {
    // Call to backend will be added here, to lock the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeState in a state
    setActiveStateId(Stage.Locked);
  };

  const handleFoundExpenditure = () => {
    // Call to backend will be added here, to found the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeState in a state
    setActiveStateId(Stage.Funded);
  };

  const handleReleaseFounds = () => {
    // Call to backend will be added here, to found the expenditure
    // fetching active state shoud be added here as well,
    // and saving the activeState in a state
    setActiveStateId(Stage.Released);
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
      buttonAction: handleFoundExpenditure,
    },
    {
      id: Stage.Funded,
      label: MSG.funded,
      buttonText: MSG.releaseFunds,
      buttonAction: handleReleaseFounds,
    },
    {
      id: Stage.Released,
      label: MSG.released,
      buttonText: MSG.claim,
      buttonAction: () => {},
    },
    {
      id: Stage.Claimed,
      label: MSG.claimed,
      buttonText: MSG.completed,
      buttonAction: () => {},
    },
  ];

  const handleSaveDraft = () =>
    openDraftConfirmDialog({
      onClick: () => setActiveStateId(Stage.Draft),
    });

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
  const canRealeseFounds = false;

  const renderButton = useCallback(() => {
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
          )}
        </>
      );
    }
    if (activeState?.buttonTooltipt) {
      return (
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
          <Button onClick={activeState?.buttonAction} style={buttonStyle}>
            {typeof activeState?.buttonText === 'string' ? (
              activeState.buttonText
            ) : (
              <FormattedMessage {...activeState?.buttonText} />
            )}
          </Button>
        </Tooltip>
      );
    }

    return (
      <Button onClick={activeState?.buttonAction} style={buttonStyle}>
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
                      onClick={handleDeleteDraft}
                      title={MSG.deleteDraft}
                    />
                  </div>
                </Tooltip>
              </span>
              <Button onClick={handleSaveDraft} style={buttonStyle}>
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
                        onClick={handleDeleteDraft}
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
  );
};

export default Stages;
