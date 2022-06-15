import React from 'react';
import { defineMessages } from 'react-intl';

import { Colony } from '~data/index';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';

import styles from './ColonyTitle.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.ColonyHome.ColonyTitleMenu.copyMessage',
    defaultMessage: 'Click to copy colony address',
  },
});

type Props = {
  colony: Colony;
  children?: React.ReactChild;
};

const displayName = 'dashboard.ColonyHome.ColonyTitleMenu';

const ColonyTitleMenu = ({ colony: { colonyAddress }, children }: Props) => {
  return (
    <div className={styles.colonyMenu}>
      {colonyAddress && (
        <InvisibleCopyableAddress
          address={colonyAddress}
          copyMessage={MSG.copyMessage}
        >
          <div className={styles.colonyAddress}>
            <MaskedAddress address={colonyAddress} />
          </div>
        </InvisibleCopyableAddress>
      )}
      {children}
    </div>
  );
};

ColonyTitleMenu.displayName = displayName;

export default ColonyTitleMenu;
