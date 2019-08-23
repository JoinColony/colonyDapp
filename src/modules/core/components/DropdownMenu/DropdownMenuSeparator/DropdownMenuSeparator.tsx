import React from 'react';

import styles from './DropdownMenuSeparator.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const displayName = 'DropdownMenuSeparator';

const DropdownMenuSeparator = ({ ...props }: Props) => (
  <li className={styles.main} {...props} role="separator" />
);

DropdownMenuSeparator.displayName = displayName;

export default DropdownMenuSeparator;
