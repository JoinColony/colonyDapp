import React, { useMemo } from 'react';
import classnames from 'classnames';
import Icon from '~core/Icon';
import { defineMessages } from 'react-intl';

import Popover from '~core/Popover';
import { AnyUser } from '~data/index';

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
  comment?: string;
  hoverState?: boolean;
}

const displayName = 'users.CommentActions';

const CommentActions = ({
  user,
  comment,
  hoverState
}: Props) => {

  return (
    <Popover
      content={({ close }) => (
        <CommentActionsPopover
          closePopover={close}
          user={user}
          comment={comment}
          hoverState={hoverState}
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
              offset: [21, 8],
            },
          },
        ],
      }}
    >
      {({ isOpen, toggle, ref, id }) => (
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
      )}
    </Popover>
  );
};

CommentActions.displayName = displayName;

export default CommentActions;
