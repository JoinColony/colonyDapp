import React, { useState, ReactNode } from 'react';

import Popover, { PopoverTriggerType } from '~core/Popover';

import InboxContainer from '../InboxContainer';

interface Props {
  children: ReactNode | PopoverTriggerType;
}

const InboxPopover = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Popover
      appearance={{ theme: 'grey' }}
      content={({ close }) => <InboxContainer close={close} />}
      placement="bottom"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
    >
      {children}
    </Popover>
  );
};

InboxPopover.displayName = 'users.Inbox.InboxPopover';

export default InboxPopover;
