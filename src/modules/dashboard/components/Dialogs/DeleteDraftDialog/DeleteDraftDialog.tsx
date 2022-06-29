import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Dialog, { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Button from '~core/Button';
import styles from './DeleteDraftDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.Expenditures.Stages.deleteDraftDialog.header',
    defaultMessage: 'Delete Expenditure',
  },
  description: {
    id: 'dashboard.Expenditures.Stages.deleteDraftDialog.description',
    defaultMessage: 'Are you sure you want to delete this draft expenditure?',
  },
  deleteText: {
    id: 'dashboard.Expenditures.Stages.deleteDraftDialog.deleteText',
    defaultMessage: 'Delete',
  },
});

const displayName = 'dashboard.DeleteDraftDialog';

interface Props {
  cancel: () => void;
  close: () => void;
  onClick?: () => void;
}

const DeleteDraftDialog = ({ cancel, onClick, close }: Props) => {
  const handleSubmit = useCallback(() => {
    onClick?.();
    close();
  }, [onClick, close]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <div className={styles.heading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            className={styles.title}
          >
            <FormattedMessage {...MSG.header} />
          </Heading>
          <FormattedMessage {...MSG.description} />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          autoFocus
          onClick={handleSubmit}
          text={MSG.deleteText}
          className={styles.button}
        />
      </DialogSection>
    </Dialog>
  );
};

DeleteDraftDialog.displayName = displayName;

export default DeleteDraftDialog;
