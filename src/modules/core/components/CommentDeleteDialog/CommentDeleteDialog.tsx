import React, { useCallback } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Comment, { Props as CommentProps } from '~core/Comment';
import { useDeleteTransactionMessageMutation } from '~data/index';

import styles from './CommentDeleteDialog.css';

const MSG = defineMessages({
  title: {
    id: 'CommentDeleteDialog.title',
    defaultMessage: 'Delete comment',
  },
  question: {
    id: 'CommentDeleteDialog.question',
    defaultMessage: `Are you sure you want to delete this message?`,
  },
  buttonCancel: {
    id: 'CommentDeleteDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonDelete: {
    id: 'CommentDeleteDialog.buttonDelete',
    defaultMessage: 'Delete',
  },
});

const displayName = 'CommentDeleteDialog';

interface Props extends DialogProps {
  comment: CommentProps;
}

const CommentDeleteDialog = ({ cancel, close, comment }: Props) => {
  const [
    deleteTransactionMessage,
    { loading },
  ] = useDeleteTransactionMessageMutation();

  const handleSubmit = useCallback(
    () =>
      deleteTransactionMessage({
        variables: {
          input: {
            colonyAddress: comment.colony.colonyAddress,
            id: comment?.commentMeta?.id || '',
          },
        },
      }).then(close),
    [comment, deleteTransactionMessage, close],
  );

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
          loading={loading}
          onClick={handleSubmit}
        />
      </DialogSection>
    </Dialog>
  );
};

CommentDeleteDialog.displayName = displayName;

export default CommentDeleteDialog;
