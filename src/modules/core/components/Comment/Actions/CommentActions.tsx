import React, { useState, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { COMMENT_MODERATION } from '~immutable/index';
import Popover from '~core/Popover';
import { ThreeDotsButton } from '~core/Button';

import { Props as CommentProps } from '../Comment';

import CommentActionsPopover from './CommentActionsPopover';

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
  const [isOpen, setOpen] = useState(false);
  /*
   * @NOTE Offset Calculations
   * This is dependant on the number of actions, may need to be adjusted
   * if more actions are added
   */
  let popoverOffset = [21, 8];
  if (permission === COMMENT_MODERATION.CAN_EDIT) {
    popoverOffset = [0, 8];
  }

  useEffect(() => {
    if (isOpen) {
      onHoverActiveState(true);
    } else {
      onHoverActiveState(false);
    }
  }, [isOpen, onHoverActiveState]);

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
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      popperOptions={{
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
      {({ ref, id }) => (
        <ThreeDotsButton
          id={id}
          innerRef={ref}
          isOpen={isOpen}
          onClick={() => setOpen(true)}
          data-test="commentActionsButton"
          title={MSG.commentActionsTitle}
        />
      )}
    </Popover>
  );
};

CommentActions.displayName = displayName;

export default CommentActions;
