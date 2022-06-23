import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import StakeExpenditureDialog from '../../Dialogs/StakeExpenditureDialog';
import StageItem from './StageItem';

import styles from './Stages.css';
import { State, ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';

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
});

const buttonStyles = {
  height: styles.buttonHeight,
  width: styles.buttonWidth,
  padding: 0,
};

interface Props {
  states: State[];
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
          {!activeState && (
            <span className={styles.notSaved}>
              <FormattedMessage {...MSG.notSaved} />
            </span>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          {!activeState ? (
            <>
              {/* Deleting the expenditure will be added in next PR */}
              <Icon name="trash" className={styles.icon} />
              <Button onClick={handleSaveDraft} style={buttonStyles}>
                <FormattedMessage {...MSG.submitDraft} />
              </Button>
            </>
          ) : (
            <>
              <Icon name="share" className={styles.icon} />
              <Button onClick={activeState?.buttonAction} style={buttonStyles}>
                {typeof activeState?.buttonText === 'string' ? (
                  activeState.buttonText
                ) : (
                  <FormattedMessage {...activeState.buttonText} />
                )}
              </Button>
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
