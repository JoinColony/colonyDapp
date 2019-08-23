import React, { useEffect, useMemo, useState, ReactElement } from 'react';

import Popover, { PopoverTriggerType } from '~core/Popover';

import { usePrevious } from '~utils/hooks';

import {
  TransactionOrMessageGroups,
  transactionCount,
} from './transactionGroup';

import GasStationContent from './GasStationContent';

interface Props {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  children: ReactElement | PopoverTriggerType;
}

const GasStationPopover = ({
  children,
  transactionAndMessageGroups,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const txCount = useMemo(() => transactionCount(transactionAndMessageGroups), [
    transactionAndMessageGroups,
  ]);
  const prevTxCount: number | void = usePrevious(txCount);
  useEffect(() => {
    if (prevTxCount != null && txCount > prevTxCount) {
      setOpen(true);
    }
  }, [txCount, prevTxCount]);

  return (
    <Popover
      appearance={{ theme: 'grey' }}
      content={({ close }) => (
        <GasStationContent
          transactionAndMessageGroups={transactionAndMessageGroups}
          close={close}
        />
      )}
      placement="bottom"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
    >
      {children}
    </Popover>
  );
};

GasStationPopover.displayName = 'users.GasStation.GasStationPopover';

export default GasStationPopover;
