import React, { ReactElement } from 'react';

import { getMainClasses } from '~utils/css';
import styles from './Table.css';

interface Appearance {
  theme?: 'dark';
  separators?: 'borders' | 'none' | 'rows';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Child elements to render */
  children: ReactElement | ReactElement[];

  /** If table is expected to be larger than its parent, and will need to scroll to show all rows */
  scrollable?: boolean;
  'data-test'?: string;
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
