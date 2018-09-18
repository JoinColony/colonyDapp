/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';
import { getMainClasses } from '~utils/css';

import React from 'react';

import styles from './Table.css';

import TableHeader from './TableHeader';
import TableBody from './TableBody';

type Appearance = {
  theme?: 'default' | 'dark',
  separators?: 'borders' | 'none' | 'rows',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Child elements to render */
  children: ChildrenArray<ElementType<typeof TableHeader | typeof TableBody>>,
};

const displayName = 'Table';

const Table = ({
  appearance = { theme: 'default', separators: 'rows' },
  children,
}: Props) => (
  <table className={getMainClasses(appearance, styles)}>{children}</table>
);

Table.displayName = displayName;

export default Table;
