import React from 'react';
import { defineMessages } from 'react-intl';

import classnames from 'classnames';
import Icon from '~core/Icon';
import Popover from '~core/Popover';
import { AnyUser } from '~data/index';
import { COMMENT_MODERATION } from '~immutable/index';

import CommentActionsPopover from './CommentActionsPopover';

import styles from './CommentActions.css';

const MSG = defineMessages({
  commentActionsTitle: {
    id: 'core.Comment.commentActionTitle',
    defaultMessage: 'Comment Actions',
  },
});

interface Props {
  user: AnyUser | null;
  permission: string;
  comment?: string;
  getHoverState?: boolean;
  onHoverActiveState?: (hoverState: boolean) => void;
}

const displayName = 'users.CommentActions';

const CommentActions = ({user, permission, comment, getHoverState, onHoverActiveState = () => null }: Props) => {
  /*
   * @NOTE Offset Calculations
   * This is dependant on the number of actions, may need to be adjusted
   * if more actions are added
   */
  let popoverOffset = [21, 8];
  if (permission === COMMENT_MODERATION.CAN_EDIT) {
    popoverOffset = [0, 8];
  }

  return (
    <Popover
      content={({ close }) => (
        <CommentActionsPopover
          closePopover={close}
          user={user}
          permission={permission}
          comment={comment}
        />
      )}
      trigger="click"
      showArrow={false}
      placement="left"
      popperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popoverOffset,
            },
          },
        ],
      }}
    >
      {({ isOpen, toggle, ref, id }) => {
        isOpen ? onHoverActiveState(true) : onHoverActiveState(false);

        return (
          <button
            id={id}
            ref={ref}
            className={classnames(styles.actionsButton, {
              [styles.activeDropdown]: isOpen,
            })}
            onClick={toggle}
            type="button"
            data-test="commentActions"
          >
            <Icon
              className={styles.actionsIcon}
              name="three-dots-row"
              title={MSG.commentActionsTitle}
            />
          </button>
        )
      }}
    </Popover>
  );
};

CommentActions.displayName = displayName;

export default CommentActions;
