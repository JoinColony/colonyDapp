import React, { ReactNode, useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { AnyUser } from '~data/index';
import { COMMENT_MODERATION } from '~immutable/index';

import styles from './CommentActionsPopover.css';

const MSG = defineMessages({
  deleteComment: {
    id: 'core.Comment.CommentActionsPopover.deleteComment',
    defaultMessage: 'Delete comment',
  },
  banFromChat: {
    id: 'core.Comment.CommentActionsPopover.banFromChat',
    defaultMessage: 'Ban from chat',
  },
});

interface Props {
  closePopover: () => void;
  user: AnyUser | null;
  permission: string;
  comment?: string;
  hoverState?: boolean;
}

const displayName = 'core.Comment.CommentActionsPopover';

const CommentActionsPopover = ({
  closePopover,
  user,
  permission,
  comment,
  hoverState,
}: Props) => {
  // Hide the action popover on mouseLeave comment
  useEffect(() => {
    if (!hoverState) {
      closePopover();
    }
  }, [hoverState]);

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

  const renderModeratorOptions = () => (
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
        <Button 
          appearance={{ theme: 'no-style' }}
          onClick={() => closePopover()}
        >
          <div className={styles.actionButton}>
            <Icon name="circle-minus" title={MSG.banFromChat} />
            <FormattedMessage {...MSG.banFromChat} />
          </div>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

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
