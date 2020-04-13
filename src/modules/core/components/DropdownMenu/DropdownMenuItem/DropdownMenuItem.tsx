import React, { HTMLAttributes } from 'react';

import styles from './DropdownMenuItem.css';

const displayName = 'DropdownMenuItem';

const DropdownMenuItem = ({
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li className={styles.main} {...props} role="menuitem">
    {children}
  </li>
);

DropdownMenuItem.displayName = displayName;

export default DropdownMenuItem;
