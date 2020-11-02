import React, { TableHTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';
import styles from './Table.css';

interface Appearance {
  theme?: 'dark' | 'rounder' | 'lined';
  separators?: 'borders' | 'none' | 'rows';
}

interface Props extends TableHTMLAttributes<HTMLTableElement> {
  /** Appearance object */
  appearance?: Appearance;

  /** If table is expected to be larger than its parent, and will need to scroll to show all rows */
  scrollable?: boolean;
}

const displayName = 'Table';

const Table = ({
  appearance = { separators: 'rows' },
  children,
  scrollable = false,
  ...props
}: Props) => (
  <table
    className={getMainClasses(appearance, styles, { scrollable })}
    {...props}
  >
    {children}
  </table>
);

Table.displayName = displayName;

export default Table;
