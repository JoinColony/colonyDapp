import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import Button from '~core/Button';
import Dialog, { DialogSection, useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';

import { Colony } from '~data/index';
import { LOCAL_STORAGE_DECISION_KEY } from '~constants';

import styles from './RemoveDraftDecisionDialog.css';

const MSG = defineMessage({
  removeDraft: {
    id: 'dashboard.RemoveDraftDecisionDialog.removeDraft',
    defaultMessage: 'Remove draft',
  },
  title: {
    id: 'dashboard.RemoveDraftDecisionDialog.title',
    defaultMessage: '{removeDraft} and create new Decision',
  },
  description: {
    id: 'dashboard.RemoveDraftDecisionDialog.description',
    defaultMessage: `You have an existing draft Decision, creating a new Decision will remove your existing draft. {viewDraftBtn}`,
  },
  newDecision: {
    id: 'dashboard.RemoveDraftDecisionDialog.newDecision',
    defaultMessage: 'New Decision',
  },
  viewDraft: {
    id: 'dashboard.RemoveDraftDecisionDialog.newDecision',
    defaultMessage: 'View draft',
  },
});

const displayName = 'dashboard.RemoveDraftDecisionDialog';

interface Props {
  cancel: () => void;
  close: () => void;
  colony: Colony;
  ethDomainId: number;
  isNewDecision: boolean;
}

const RemoveDraftDecisionDialog = ({
  cancel,
  close,
  colony,
  colony: { colonyName },
  ...props
}: Props) => {
  const history = useHistory();
  const redirectToPreview = () => {
    close();
    history.push(`/colony/${colonyName}/decisions/preview`);
  };

  const openDecisionDialog = useDialog(DecisionDialog);

  return (
    <Dialog cancel={cancel}>
      <DialogSection>
        <Heading
          text={MSG.title}
          textValues={{
            // @ts-ignore
            removeDraft: (
              <span className={styles.redTitle}>
                <FormattedMessage {...MSG.removeDraft} />
              </span>
            ),
          }}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
        <div>
          <FormattedMessage
            {...MSG.description}
            values={{
              viewDraftBtn: (
                <Button
                  text={MSG.viewDraft}
                  appearance={{ theme: 'blue' }}
                  onClick={redirectToPreview}
                />
              ),
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.newDecision}
          onClick={() => {
            localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
            close();
            openDecisionDialog({ ...props, colony });
          }}
        />
      </DialogSection>
    </Dialog>
  );
};

RemoveDraftDecisionDialog.displayName = displayName;

export default RemoveDraftDecisionDialog;
