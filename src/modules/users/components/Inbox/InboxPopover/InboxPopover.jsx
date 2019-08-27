/* @flow */

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import React, { useState } from 'react';

import type { PopoverTriggerType } from '~core/Popover';

import Popover from '~core/Popover';

import InboxContainer from '../InboxContainer';

type Props = {|
  children: React$Element<*> | PopoverTriggerType,
|};

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
