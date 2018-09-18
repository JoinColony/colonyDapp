/* @flow */
import type { Node } from 'react';

import React from 'react';
import { getMainClasses } from '~utils/css';

import styles from './DropdownMenu.css';

type Appearance = {
  theme?: 'dark',
};

type Props = {
  children: Node,
  appearance?: Appearance,
};

const displayName = 'DropdownMenu';

const DropdownMenu = ({ appearance, children, ...props }: Props) => (
  <div className={getMainClasses(appearance, styles)} {...props}>
    {children}
  </div>
);

DropdownMenu.displayName = displayName;

export default DropdownMenu;
