import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import Popover from '~core/Popover';
import { ThreeDotsButton } from '~core/Button';
import { Colony } from '~data/index';

import MemberActionsPopover from './MemberActionsPopover';

import { query700 as query } from '~styles/queries.css';

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
  const isMobile = useMediaQuery({ query });
  const offset = isMobile ? [0, 0] : [40, 15];

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
              offset,
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
