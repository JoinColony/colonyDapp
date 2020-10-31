import React, { useState, ReactElement, useMemo } from 'react';

import Popover, { PopoverChildFn } from '~core/Popover';
import { ConnectWalletContent } from '../ConnectWalletWizard';

import { removeValueUnits } from '~utils/css';

import {
  refWidth,
  horizontalOffset,
  verticalOffset,
} from './ConnectWalletPopover.css';

interface Props {
  children: ReactElement | PopoverChildFn;
}

const ConnectWalletPopover = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false);

  /*
   * @NOTE Offset Calculations
   * See: https://popper.js.org/docs/v2/modifiers/offset/
   *
   * Skidding:
   * The Width of the reference element (width) plus the horizontal offset
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
      content={() => <ConnectWalletContent />}
      placement="bottom"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
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
      {children}
    </Popover>
  );
};

ConnectWalletPopover.displayName =
  'users.ConnectWalletWizard.ConnectWalletPopover';

export default ConnectWalletPopover;
