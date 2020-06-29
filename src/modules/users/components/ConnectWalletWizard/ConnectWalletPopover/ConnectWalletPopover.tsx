import React, { useState, ReactElement } from 'react';

import Popover, { PopoverTriggerType } from '~core/Popover';
import { ConnectWalletContent } from '../ConnectWalletWizard';

interface Props {
  children: ReactElement | PopoverTriggerType;
}

const ConnectWalletPopover = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Popover
      appearance={{ theme: 'grey' }}
      content={() => <ConnectWalletContent />}
      placement="bottom"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
    >
      {children}
    </Popover>
  );
};

ConnectWalletPopover.displayName =
  'users.ConnectWalletWizard.ConnectWalletPopover';

export default ConnectWalletPopover;
