/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './DropdownMenuSection.css';

type Props = {
  children: Node,
  className?: string,
  separator?: boolean,
};

const displayName = 'DropdownMenuSection';

const DropdownMenuSection = ({ children, separator, className }: Props) => {
  const mainClass = separator
    ? `${styles.main} ${styles.separator}`
    : styles.main;
  const classNames = className ? `${mainClass} ${className}` : mainClass;
  return (
    <ul className={classNames} role="menu">
      {children}
    </ul>
  );
};

DropdownMenuSection.displayName = displayName;

export default DropdownMenuSection;
