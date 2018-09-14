/* @flow */
import React from 'react';

import styles from './DropdownMenuSeparator.css';

const displayName = 'DropdownMenuSeparator';

const DropdownMenuSeparator = () => (
  <li className={styles.main} role="separator" />
);

DropdownMenuSeparator.displayName = displayName;

export default DropdownMenuSeparator;
