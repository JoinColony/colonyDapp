import React from 'react';
import { defineMessages } from 'react-intl';

import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import styles from './ColonyAddress.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.ColonyHome.ColonyTitle.ColonyAddress.copyMessage',
    defaultMessage: 'Click to copy colony address',
  },
});

interface Props {
  colonyAddress: string;
}

const displayName = 'dashboard.ColonyHome.ColonyTitle.ColonyAddress';

const ColonyAddress = ({ colonyAddress }: Props) => (
  <InvisibleCopyableAddress
    address={colonyAddress}
    copyMessage={MSG.copyMessage}
  >
    <div className={styles.colonyAddress}>
      <MaskedAddress address={colonyAddress} />
    </div>
  </InvisibleCopyableAddress>
);

ColonyAddress.displayName = displayName;

export default ColonyAddress;
