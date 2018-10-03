/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';
import { getMainClasses } from '~utils/css';

import React from 'react';

import styles from './Table.css';

type Appearance = {
  theme?: 'dark',
  separators?: 'borders' | 'none' | 'rows',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Child elements to render */
  children: ChildrenArray<ElementType<*>>,
  /** If table is expected to be larger than its parent, and will need to scroll to show all rows */
  scrollable?: boolean,
};

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
