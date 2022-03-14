import React, { useCallback } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import Comment, { Props as CommentProps } from '~core/Comment';
import {
  useDeleteTransactionMessageMutation,
  useUndeleteTransactionMessageMutation,
} from '~data/index';

import styles from './DeleteComment.css';

const MSG = defineMessages({
  title: {
    id: 'core.Comment.DeleteComment.title',
    defaultMessage: `{undelete, select,
      true {Restore}
      other {Delete}
    } comment`,
  },
  question: {
    id: 'core.Comment.DeleteComment.question',
    defaultMessage: `Are you sure you want to {undelete, select,
      true {restore}
      other {delete}
    } this message?`,
  },
  buttonCancel: {
    id: 'core.Comment.DeleteComment.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonDelete: {
    id: 'core.Comment.DeleteComment.buttonDelete',
    defaultMessage: `{undelete, select,
      true {Restore}
      other {Delete}
    }`,
  },
});

const displayName = 'core.Comment.DeleteComment';

interface Props extends DialogProps {
  comment: CommentProps;
  undelete?: boolean;
}

const DeleteComment = ({ cancel, close, comment, undelete = false }: Props) => {
  const updateMutationHook = !undelete
    ? useDeleteTransactionMessageMutation
    : useUndeleteTransactionMessageMutation;
  const [updateTransactionMessage, { loading }] = updateMutationHook();

  const handleSubmit = useCallback(
    () =>
      (updateTransactionMessage({
        variables: {
          input: {
            colonyAddress: comment.colony.colonyAddress,
            id: comment?.commentMeta?.id || '',
          },
        },
      }) as Promise<boolean>).then(close),
    [comment, updateTransactionMessage, close],
  );

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
            textValues={{ undelete }}
          />
        </div>
        <div className={styles.modalContent}>
          <FormattedMessage {...MSG.question} values={{ undelete }} />
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
          appearance={{ theme: undelete ? 'primary' : 'pink', size: 'large' }}
          text={MSG.buttonDelete}
          textValues={{ undelete }}
          style={{ width: styles.wideButton }}
          loading={loading}
          onClick={handleSubmit}
          data-test="moderateCommentConfirmButton"
        />
      </DialogSection>
    </Dialog>
  );
};

DeleteComment.displayName = displayName;

export default DeleteComment;
