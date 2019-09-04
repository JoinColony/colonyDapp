import React, { ReactNode } from 'react';

import styles from './DropdownMenuSection.css';

interface Props {
  children: ReactNode;
  separator?: boolean;
}

const displayName = 'DropdownMenuSection';

const DropdownMenuSection = ({ children, separator, ...props }: Props) => (
  <ul
    className={separator ? styles.separator : undefined}
    {...props}
    role="menu"
  >
    {children}
  </ul>
);

DropdownMenuSection.displayName = displayName;

export default DropdownMenuSection;
