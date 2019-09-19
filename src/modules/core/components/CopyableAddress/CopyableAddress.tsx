import React, { useCallback } from 'react';
import { splitAddress } from '~utils/strings';

import { Address } from '~types/index';

import { getMainClasses } from '~utils/css';
import MaskedAddress from '~core/MaskedAddress';
import ClipboardCopy from '~core/ClipboardCopy';

import styles from './CopyableAddress.css';

interface Appearance {
  theme: 'big';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;
  /** Address to display */
  children: Address;
  /** Indicates that the full address should be shown instead of an abbreviated one */
  full?: boolean;
  /** In some occasions we want to show the button to copy only */
  hideAddress?: boolean;
}

const displyName = 'CopyableAddress';

const CopyableAddress = ({
  appearance,
  children: address,
  full,
  hideAddress = false,
}: Props) => {
  const getAddress = useCallback(() => {
    const addressElements = splitAddress(address);
    if (full && !(addressElements instanceof Error)) {
      return (
        <div>
          <span className={styles.boldAddress}>{addressElements.header}</span>
          <span className={styles.boldAddress}>{addressElements.start}</span>
          <span className={styles.address}>{addressElements.middle}</span>
          <span className={styles.boldAddress}>{addressElements.end}</span>
        </div>
      );
    }
    return <MaskedAddress address={address} />;
  }, [address, full]);
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.addressContainer}>
        {!hideAddress && getAddress()}
      </div>
      <span className={styles.copyButton}>
        <ClipboardCopy value={address} />
      </span>
    </div>
  );
};

CopyableAddress.displayName = displyName;

export default CopyableAddress;
