import React from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Comment, { Props as CommentProps } from '~core/Comment';

import styles from './DeleteCommentDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.DeleteCommentDialog.title',
    defaultMessage: 'Delete comment',
  },
  question: {
    id: 'dashboard.CoinMachine.DeleteCommentDialog.question',
    defaultMessage: `Are you sure you want to delete this message?`,
  },
  buttonCancel: {
    id: 'dashboard.CoinMachine.DeleteCommentDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonDelete: {
    id: 'dashboard.CoinMachine.DeleteCommentDialog.buttonDelete',
    defaultMessage: 'Delete',
  },
});

const displayName = 'dashboard.CoinMachine.DeleteCommentDialog';

interface Props extends DialogProps {
  comment: CommentProps;
}

const DeleteCommentDialog = ({ cancel, comment }: Props) => {
  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
        <div className={styles.modalContent}>
          <FormattedMessage {...MSG.question} />
        </div>
        {comment && (
          <div className={styles.comment}>
            <Comment {...comment} />
          </div>
        )}
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={MSG.buttonCancel}
          onClick={cancel}
        />
        <Button
          appearance={{ theme: 'pink', size: 'large' }}
          text={MSG.buttonDelete}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </Dialog>
  );
};

DeleteCommentDialog.displayName = displayName;

export default DeleteCommentDialog;
