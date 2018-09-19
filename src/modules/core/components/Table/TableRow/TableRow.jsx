/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import styles from './TableRow.css';

import TableCell from '../TableCell';
import TableHeaderCell from '../TableHeaderCell';

type Props = {
  // eslint-disable-next-line max-len, prettier/prettier
  children: ChildrenArray<ElementType<typeof TableCell | typeof TableHeaderCell>>,
};

const displayName = 'TableRow';

const TableRow = ({ children, ...props }: Props) => (
  <tr className={styles.main} {...props}>
    {children}
  </tr>
);

TableRow.displayName = displayName;

export default TableRow;
