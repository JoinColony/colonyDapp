import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './DropdownMenu.css';

interface Appearance {
  theme?: 'dark';
}

interface Props {
  children: ReactNode;
  appearance?: Appearance;
  onClick?: Function;
}

const displayName = 'DropdownMenu';

const DropdownMenu = ({ appearance, children, ...props }: Props) => (
  // @ts-ignore
  <div className={getMainClasses(appearance, styles)} {...props}>
    {children}
  </div>
);

DropdownMenu.displayName = displayName;

export default DropdownMenu;
