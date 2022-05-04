import React, { useState, ReactNode, useMemo } from 'react';

import Popover, { PopoverTriggerType } from '~core/Popover';
import { Notifications } from '~data/index';
import InboxContainer from '../InboxContainer';

import { removeValueUnits } from '~utils/css';

import { refWidth, horizontalOffset, verticalOffset } from './InboxPopover.css';

interface Props {
  children: ReactNode | PopoverTriggerType;
  notifications: Notifications;
}

const InboxPopover = ({ children, notifications }: Props) => {
  const [isOpen, setOpen] = useState(false);

  /*
   * @NOTE Offset Calculations
   * See: https://popper.js.org/docs/v2/modifiers/offset/
   *
   * Skidding:
   * Half the width of the reference element (width) plus the horizontal offset
   * Note that all skidding, for bottom aligned elements, needs to be negative.
   *
   * Distace:
   * This is just the required offset in pixels. Since we are aligned at
   * the bottom of the screen, this will be added to the bottom of the
   * reference element.
   */
  const popoverOffset = useMemo(() => {
    const skid =
      removeValueUnits(refWidth) + removeValueUnits(horizontalOffset);
    return [-1 * skid, removeValueUnits(verticalOffset)];
  }, []);

  return (
    <Popover
      appearance={{ theme: 'grey' }}
      content={({ close }) => (
        <InboxContainer
          close={close}
          notifications={notifications}
          limit={10}
        />
      )}
      placement="bottom"
      showArrow={false}
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
      {children}
    </Popover>
  );
};

InboxPopover.displayName = 'users.Inbox.InboxPopover';

export default InboxPopover;
