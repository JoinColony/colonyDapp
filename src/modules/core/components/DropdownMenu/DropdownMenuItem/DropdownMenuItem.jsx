/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './DropdownMenuItem.css';

type Props = {
  children: Node,
};

const displayName = 'DropdownMenuItem';

const DropdownMenuItem = ({ children }: Props) => (
  <li className={styles.main} role="menuitem">
    {children}
  </li>
);

DropdownMenuItem.displayName = displayName;

export default DropdownMenuItem;
