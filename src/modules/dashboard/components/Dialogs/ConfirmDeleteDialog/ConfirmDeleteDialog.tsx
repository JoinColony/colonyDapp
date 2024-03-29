import React, { ReactElement } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';

import styles from './ConfirmDeleteDialog.css';

const MSG = defineMessage({
  title: {
    id: 'dashboard.ConfirmDeleteDialog.title',
    defaultMessage: 'Delete draft {itemName}',
  },
  description: {
    id: 'dashboard.ConfirmDeleteDialog.description',
    defaultMessage: 'Are you sure you want to delete this draft {itemName}?',
  },
});

const displayName = 'dashboard.ConfirmDeleteDialog';

interface Props {
  itemName: ReactElement;
  deleteCallback: () => void;
  cancel: () => void;
  close: () => void;
}

const ConfirmDeleteDialog = ({
  cancel,
  close,
  itemName,
  deleteCallback,
}: Props) => {
  const deleteItem = () => {
    close();
    deleteCallback();
  };

  return (
    <Dialog cancel={cancel}>
      <DialogSection>
        <div className={styles.heading}>
          <Heading
            text={MSG.title}
            /* react-intl has wrong types for the formatMessage funtion that is used in the button.
          There will be a type error if there is no type casting although it's all working correctly */
            // @ts-ignore
            textValues={{ itemName }}
            appearance={{ size: 'medium' }}
          />
          <FormattedMessage {...MSG.description} values={{ itemName }} />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <div className={styles.button}>
          <Button
            text={{ id: 'button.delete' }}
            appearance={{ theme: 'pink', size: 'large' }}
            onClick={deleteItem}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

ConfirmDeleteDialog.displayName = displayName;

export default ConfirmDeleteDialog;
