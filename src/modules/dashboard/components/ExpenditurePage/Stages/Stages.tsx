import React, { useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Icon from '~core/Icon';
import DraftConfirmDialog from './DraftConfirmDialog';
import StageItem from './StageItem';

import styles from './Stages.css';

const MSG = defineMessages({
  stages: {
    id: 'dashboard.Expenditures.Stages.defaultText',
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

interface ActiveState {
  id: number;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
}

const Stages = () => {
  const [activeState, setActiveState] = useState<ActiveState | null>(null);

  const openDraftConfirmDialog = useDialog(DraftConfirmDialog);

  const states = [
    {
      id: 1,
      label: MSG.draft,
      buttonText: MSG.lockValues,
      buttonAction: () => {},
    },
    {
      id: 2,
      label: MSG.locked,
      buttonText: MSG.escrowFunds,
      buttonAction: () => {},
    },
    {
      id: 3,
      label: MSG.funded,
      buttonText: MSG.releaseFunds,
      buttonAction: () => {},
    },
    {
      id: 4,
      label: MSG.released,
      buttonText: MSG.claim,
      buttonAction: () => {},
    },
    {
      id: 5,
      label: MSG.claimed,
      buttonText: MSG.completed,
      buttonAction: () => {},
    },
  ];

  const handleSaveDraft = () =>
    openDraftConfirmDialog({
      onClick: () => setActiveState(states[0]),
    });
  const activeIndex = states.findIndex((state) => state.id === activeState?.id);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.statusContainer}>
        <span>
          <span className={styles.status}>
            <FormattedMessage {...MSG.stages} />
          </span>
          {!activeState && (
            <span className={styles.notSaved}>
              <FormattedMessage {...MSG.notSaved} />
            </span>
          )}
        </span>
        <div className={styles.buttonsContainer}>
          {!activeState ? (
            <>
              {/* Deleting the expenditure will be added in next PR */}
              <Icon name="trash" className={styles.icon} />
              {/* onClick has temporary action, needs to be submiting draft in the future */}
              <Button onClick={handleSaveDraft} style={{ height: '29px' }}>
                <FormattedMessage {...MSG.submitDraft} />
              </Button>
            </>
          ) : (
            <>
              <Icon name="share" className={styles.icon} />
              <Button
                onClick={activeState?.buttonAction}
                style={{ height: '29px' }}
              >
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
