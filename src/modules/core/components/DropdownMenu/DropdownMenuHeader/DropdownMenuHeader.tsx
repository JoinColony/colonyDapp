import React, { ReactNode } from 'react';

import styles from './DropdownMenuHeader.css';

interface Props {
  children: ReactNode;
}

const displayName = 'DropdownMenuHeader';

const DropdownMenuHeader = ({ children, ...props }: Props) => (
  <li className={styles.main} {...props} role="menuitem">
    {children}
  </li>
);

DropdownMenuHeader.displayName = displayName;

export default DropdownMenuHeader;
