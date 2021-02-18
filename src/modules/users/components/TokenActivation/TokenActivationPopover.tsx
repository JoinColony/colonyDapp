import React, { ReactElement } from 'react';

import Popover, { PopoverChildFn } from '~core/Popover';

import TokenActivationContent from './TokenActivationContent';

interface Props {
  children: ReactElement | PopoverChildFn;
}

const TokenActivationPopover = ({ children }: Props) => {
  return (
    <Popover content={() => <TokenActivationContent />}>{children}</Popover>
  );
};

export default TokenActivationPopover;
