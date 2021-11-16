import React from 'react';
import { defineMessages } from 'react-intl';

import classnames from 'classnames';
import { COMMENT_MODERATION } from '~immutable/index';
import Icon from '~core/Icon';
import Popover from '~core/Popover';

import { Props as CommentProps } from '../Comment';

import CommentActionsPopover from './CommentActionsPopover';

import styles from './CommentActions.css';

const MSG = defineMessages({
  commentActionsTitle: {
    id: 'core.Comment.CommentActions.commentActionTitle',
    defaultMessage: 'Comment Actions',
  },
});

interface Props {
  permission: string;
  fullComment?: CommentProps;
  onHoverActiveState?: (hoverState: boolean) => void;
}

const displayName = 'core.Comment.CommentActions';

const CommentActions = ({
  permission,
  fullComment,
  onHoverActiveState = () => null,
}: Props) => {
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
          permission={permission}
          fullComment={fullComment}
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
        if (isOpen) {
          onHoverActiveState(true);
        } else {
          onHoverActiveState(false);
        }
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
        );
      }}
    </Popover>
  );
};

CommentActions.displayName = displayName;

export default CommentActions;
