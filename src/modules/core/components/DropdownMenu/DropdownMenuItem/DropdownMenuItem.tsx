import React, { ReactNode } from 'react';

import styles from './DropdownMenuItem.css';

interface Props {
  children: ReactNode;
}

const displayName = 'DropdownMenuItem';

const DropdownMenuItem = ({ children, ...props }: Props) => (
  <li className={styles.main} {...props} role="menuitem">
    {children}
  </li>
);

DropdownMenuItem.displayName = displayName;

export default DropdownMenuItem;
