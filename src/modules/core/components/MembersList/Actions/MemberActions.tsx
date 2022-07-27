import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import Popover from '~core/Popover';
import { Colony } from '~data/index';

import MemberActionsPopover from './MemberActionsPopover';

import ThreeDotsButton from '~core/Button/ThreeDotsButton';

const MSG = defineMessages({
  memberActionsTitle: {
    id: 'core.MemberList.MemberActions.MemberActionTitle',
    defaultMessage: 'Member Actions',
  },
});

interface Props {
  userAddress: string;
  colony: Colony;
  isWhitelisted: boolean;
  isBanned: boolean;
  canAdministerComments?: boolean;
}

const displayName = 'core.MemberList.MemberActions';

const MemberActions = ({
  canAdministerComments,
  colony,
  userAddress,
  isWhitelisted,
  isBanned,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Popover
      content={({ close }) => (
        <MemberActionsPopover
          closePopover={close}
          canAdministerComments={canAdministerComments}
          colony={colony}
          isWhitelisted={isWhitelisted}
          isBanned={isBanned}
          userAddress={userAddress}
        />
      )}
      trigger="click"
      showArrow={false}
      placement="right"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [40, 15],
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
          title={MSG.memberActionsTitle}
        />
      )}
    </Popover>
  );
};

MemberActions.displayName = displayName;

export default MemberActions;
