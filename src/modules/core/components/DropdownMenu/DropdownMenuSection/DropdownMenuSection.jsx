/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './DropdownMenuSection.css';

type Props = {
  children: Node,
  separator?: boolean,
};

const displayName = 'DropdownMenuSection';

const DropdownMenuSection = ({ children, separator }: Props) => (
  <ul className={separator ? styles.separator : null} role="menu">
    {children}
  </ul>
);

DropdownMenuSection.displayName = displayName;

export default DropdownMenuSection;
