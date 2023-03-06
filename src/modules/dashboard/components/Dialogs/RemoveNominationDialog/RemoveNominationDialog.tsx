import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Dialog, { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Button from '~core/Button';
import styles from './RemoveNominationDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.RemoveNominationDialog.header',
    defaultMessage: 'Remove your Protector Nomination',
  },
  description: {
    id: 'dashboard.RemoveNominationDialog.description',
    defaultMessage:
      'Are you sure you want to remove your Protector nomination?',
  },
  deleteText: {
    id: 'dashboard.RemoveNominationDialog.deleteText',
    defaultMessage: 'Yes, remove',
  },
});

const displayName = 'dashboard.RemoveNominationDialog';

interface Props {
  cancel: () => void;
  close: () => void;
  onClick?: () => void;
}

const RemoveNominationDialog = ({ cancel, onClick, close }: Props) => {
  const handleSubmit = useCallback(() => {
    onClick?.();
    close();
  }, [onClick, close]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <div className={styles.wrapper}>
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

RemoveNominationDialog.displayName = displayName;

export default RemoveNominationDialog;
