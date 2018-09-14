/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './DropdownMenuItem.css';

type Props = {
  children: Node,
  className?: string,
};

const displayName = 'DropdownMenuItem';

const DropdownMenuItem = ({ className, children }: Props) => {
  const mainClass = styles.main;
  const classNames = className ? `${mainClass} ${className}` : mainClass;
  return (
    <li className={classNames} role="menuitem">
      {children}
    </li>
  );
};

DropdownMenuItem.displayName = displayName;

export default DropdownMenuItem;
