/* @flow */
import type { Node } from 'react';

import React from 'react';
import { getMainClasses } from '~utils/css';

import styles from './DropdownMenu.css';

type Appearance = {
  theme?: 'default' | 'dark',
};

type Props = {
  children: Node,
  className?: string,
  appearance?: Appearance,
};

const displayName = 'DropdownMenu';

const DropdownMenu = ({
  appearance = { theme: 'default' },
  children,
  className,
}: Props) => {
  const themeClasses = getMainClasses(appearance, styles);
  const classNames = className ? `${themeClasses} ${className}` : themeClasses;
  return <div className={`${styles.main} ${classNames}`}>{children}</div>;
};

DropdownMenu.displayName = displayName;

export default DropdownMenu;
