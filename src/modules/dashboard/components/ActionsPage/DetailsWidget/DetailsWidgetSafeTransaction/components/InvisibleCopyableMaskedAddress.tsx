import React from 'react';
import { Placement } from '@popperjs/core';

import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';

interface InvisibleCopyableMaskedAddressProps {
  address: string;
  tooltipPlacement?: Placement;
}

export const InvisibleCopyableMaskedAddress = ({
  address,
  tooltipPlacement = 'right',
}: InvisibleCopyableMaskedAddressProps) => (
  <InvisibleCopyableAddress
    address={address}
    tooltipPlacement={tooltipPlacement}
  >
    <MaskedAddress address={address} />
  </InvisibleCopyableAddress>
);
