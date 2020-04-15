import React, { HTMLAttributes } from 'react';

import styles from './DropdownMenuHeader.css';

const displayName = 'DropdownMenuHeader';

const DropdownMenuHeader = ({
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li className={styles.main} role="menuitem" {...props}>
    {children}
  </li>
);

DropdownMenuHeader.displayName = displayName;

export default DropdownMenuHeader;
