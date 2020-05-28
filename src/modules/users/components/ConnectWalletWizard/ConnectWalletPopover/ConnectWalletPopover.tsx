import React, { useState, ReactElement } from 'react';

import Popover, { PopoverTriggerType } from '~core/Popover';
import { ConnectWalletContent } from '../ConnectWalletWizard';

// import { usePrevious } from '~utils/hooks';

// import {
//   TransactionOrMessageGroups,
//   transactionCount,
// } from './transactionGroup';

// import GasStationContent from './GasStationContent';

interface Props {
  // transactionAndMessageGroups: TransactionOrMessageGroups;
  children: ReactElement | PopoverTriggerType;
}

const ConnectWalletPopover = ({
  children,
}: // transactionAndMessageGroups,
Props) => {
  const [isOpen, setOpen] = useState(false);
  // const txCount = useMemo(() => transactionCount(transactionAndMessageGroups), [
  //   transactionAndMessageGroups,
  // ]);
  // const prevTxCount: number | void = usePrevious(txCount);
  // useEffect(() => {
  //   if (prevTxCount != null && txCount > prevTxCount) {
  //     setOpen(true);
  //   }
  // }, [txCount, prevTxCount]);

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
