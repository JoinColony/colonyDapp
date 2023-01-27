import React from 'react';

import { ColonySafe } from '~data/index';

import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Icon from '~core/Icon';

import styles from './SafeInfo.css';

interface Props {
  safe: ColonySafe;
}

const displayName = 'InfoPopover.SafeInfoPopover.SafeInfo';

const SafeInfo = ({ safe }: Props) => {
  return (
    <div className={styles.container}>
      <Icon className={styles.safeLogo} name="safe-logo" />
      <div className={styles.textContainer}>
        <Heading
          appearance={{ margin: 'none', size: 'normal' }}
          text={safe.safeName}
          className={styles.userName}
        />
        <div className={styles.address}>
          <CopyableAddress full>{safe.contractAddress}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

SafeInfo.displayName = displayName;

export default SafeInfo;
