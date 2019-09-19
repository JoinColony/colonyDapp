import React, { Component, SyntheticEvent } from 'react';
import copy from 'copy-to-clipboard';
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

class CopyableAddress extends Component<Props> {
  static defaultProps = {
    hideAddress: false,
  };

  getAddress = () => {
    const { children: address, full } = this.props;
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
  };

  render() {
    const { appearance, hideAddress, children: address } = this.props;
    return (
      <div className={getMainClasses(appearance, styles)}>
        <div className={styles.addressContainer}>
          {!hideAddress && this.getAddress()}
        </div>
        <span className={styles.copyButton}>
          <ClipboardCopy value={address} />
        </span>
      </div>
    );
  }
}

export default CopyableAddress;
