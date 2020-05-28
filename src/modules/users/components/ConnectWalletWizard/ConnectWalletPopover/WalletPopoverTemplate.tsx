import React, { ReactElement } from 'react';

import styles from './WalletPopoverTemplate.css';

interface Props {
  children: ReactElement;
}

const WalletPopoverTemplate = ({ children }: Props) => (
  <div className={styles.main}>{children}</div>
);

WalletPopoverTemplate.displayName =
  'users.ConnectWalletPopover.WalletPopoverTemplate';

export default WalletPopoverTemplate;
