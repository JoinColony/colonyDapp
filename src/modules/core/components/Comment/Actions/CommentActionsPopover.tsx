import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { COMMENT_MODERATION } from '~immutable/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { useDialog } from '~core/Dialog';

import { BanCommentDialog, DeleteCommentDialog } from '../Dialogs';
import { Props as CommentProps } from '../Comment';

import styles from './CommentActionsPopover.css';

const MSG = defineMessages({
  deleteComment: {
    id: 'core.Comment.CommentActionsPopover.deleteComment',
    defaultMessage: `{undelete, select,
      true {Restore}
      other {Delete}
    } comment`,
  },
  banFromChat: {
    id: 'core.Comment.CommentActionsPopover.banFromChat',
    defaultMessage: `{unban, select,
      true {Unban}
      other {Ban}
    } from chat`,
  },
});

interface Props {
  closePopover: () => void;
  permission: string;
  fullComment?: CommentProps;
}

const displayName = 'core.Comment.CommentActionsPopover';

const CommentActionsPopover = ({
  closePopover,
  permission,
  fullComment,
}: Props) => {
  const openDeleteCommentDialog = useDialog(DeleteCommentDialog);
  const openBanUserDialog = useDialog(BanCommentDialog);

  const handleDeleteComment = useCallback(
    (undelete = false) =>
      openDeleteCommentDialog({
        comment: {
          ...fullComment,
          showControls: false,
        } as CommentProps,
        undelete,
      }),
    [fullComment, openDeleteCommentDialog],
  );

  const handleBanUser = useCallback(
    (unban = false) =>
      openBanUserDialog({
        comment: {
          ...fullComment,
          showControls: false,
        } as CommentProps,
        unban,
      }),
    [fullComment, openBanUserDialog],
  );

  const renderUserActions = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Button
          appearance={{ theme: 'no-style' }}
          onClick={() => closePopover()}
        >
          <div className={styles.actionButton}>
            <Icon name="trash" title={MSG.deleteComment} />
            <FormattedMessage {...MSG.deleteComment} />
          </div>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderModeratorOptions = () => {
    const commentDeleted = fullComment?.commentMeta?.adminDelete || false;
    const userBanned = fullComment?.commentMeta?.userBanned || false;
    return (
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => handleDeleteComment(commentDeleted)}
            data-cy="moderate-comment-button"
          >
            <div className={styles.actionButton}>
              <Icon
                name={commentDeleted ? 'arrow-rotate-ccw' : 'trash'}
                title={MSG.deleteComment}
                titleValues={{ undelete: commentDeleted }}
              />
              <FormattedMessage
                {...MSG.deleteComment}
                values={{ undelete: commentDeleted }}
              />
            </div>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => handleBanUser(userBanned)}
            data-cy="moderate-user-button"
          >
            <div className={styles.actionButton}>
              <Icon
                name={userBanned ? 'user-plus' : 'circle-minus'}
                title={MSG.banFromChat}
                titleValues={{ unban: userBanned }}
              />
              <FormattedMessage
                {...MSG.banFromChat}
                values={{ unban: userBanned }}
              />
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuSection>
    );
  };

  return (
    <DropdownMenu onClick={closePopover}>
      {permission === COMMENT_MODERATION.CAN_MODERATE ? (
        <>{renderModeratorOptions()}</>
      ) : null}
      {permission === COMMENT_MODERATION.CAN_EDIT ? (
        <>{renderUserActions()}</>
      ) : null}
    </DropdownMenu>
  );
};

CommentActionsPopover.displayName = displayName;

export default CommentActionsPopover;
