/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './DropdownMenuHeader.css';

type Props = {|
  children: Node,
|};

const displayName = 'DropdownMenuHeader';

const DropdownMenuHeader = ({ children, ...props }: Props) => (
  <li className={styles.main} {...props} role="menuitem">
    {children}
  </li>
);

DropdownMenuHeader.displayName = displayName;

export default DropdownMenuHeader;
