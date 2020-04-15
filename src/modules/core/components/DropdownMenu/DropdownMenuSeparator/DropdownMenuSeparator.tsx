import React, { HTMLAttributes } from 'react';

import styles from './DropdownMenuSeparator.css';

const displayName = 'DropdownMenuSeparator';

const DropdownMenuSeparator = ({ ...props }: HTMLAttributes<HTMLLIElement>) => (
  <li className={styles.main} {...props} role="separator" />
);

DropdownMenuSeparator.displayName = displayName;

export default DropdownMenuSeparator;
