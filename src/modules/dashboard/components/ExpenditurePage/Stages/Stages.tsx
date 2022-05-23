import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
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

const stageStates = [
  { label: MSG.draft, active: false, buttonText: 'Lock values', order: 1 },
  { label: MSG.locked, active: false, buttonText: 'Escrow funds', order: 2 },
  { label: MSG.funded, active: false, buttonText: 'Release funds', order: 3 },
  { label: MSG.released, active: true, buttonText: 'Claim', order: 4 },
  { label: MSG.claimed, active: false, buttonText: 'Completed', order: 5 },
];

const Stages = () => {
  const activeState = stageStates.find((state) => state.active);
  const openDialog = useDialog(DraftConfirmDialog);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.statusContainer}>
        <span className={styles.status}>
          <FormattedMessage {...MSG.stages} />
        </span>
        <div className={styles.buttonsContainer}>
          {!activeState ? (
            <>
              <Icon name="trash" className={styles.icon} />
              <Button>
                <FormattedMessage {...MSG.submitDraft} />
              </Button>
            </>
          ) : (
            <>
              <Icon name="share" className={styles.icon} />
              <Button onClick={() => openDialog()}>
                {activeState?.buttonText}
              </Button>
            </>
          )}
        </div>
      </div>
      {stageStates.map(({ label }, index) => (
        <StageItem
          label={label}
          isFirst={index === 0}
          isActive={activeState ? index + 1 <= activeState.order : false}
        />
      ))}
    </div>
  );
};

export default Stages;
