import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Dialog, { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './DeleteDraftIncorporationDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.DeleteDraftIncorporationDialog.header',
    defaultMessage: 'Delete draft Incorporation',
  },
  description: {
    id: 'dashboard.DeleteDraftIncorporationDialog.description',
    defaultMessage: `Are you sure you want to delete this draft incorporation?`,
  },
  deleteText: {
    id: 'dashboard.DeleteDraftIncorporationDialog.deleteText',
    defaultMessage: 'Yes, delete',
  },
});

const displayName = 'dashboard.DeleteDraftIncorporationDialog';

interface Props {
  cancel: () => void;
  close: () => void;
  onClick?: () => void;
}

const DeleteDraftIncorporationDialog = ({ cancel, onClick, close }: Props) => {
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

DeleteDraftIncorporationDialog.displayName = displayName;

export default DeleteDraftIncorporationDialog;
