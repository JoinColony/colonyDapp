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
      popperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Offset Calculations
               * See: https://popper.js.org/docs/v2/modifiers/offset/
               *
               * Skidding:
               * Half the width of the content + half the width of the reference.
               * This will get you aligned to the right side (this just for this instance,
               * where alignment is at the bottom).
               * To this we add the required offset size in pixels.
               * Note that all skidding, for bottom alignment, needs to be negative.
               *
               * Distace:
               * This is just the required offset in pixels. Since we are aligned at
               * the bottom of the screen, this will be added to the bottom of the
               * reference element.
               */
              offset: [-167, 22],
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  );
};

GasStationPopover.displayName = 'users.GasStation.GasStationPopover';

export default GasStationPopover;
