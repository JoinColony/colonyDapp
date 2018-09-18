/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableRow.css';

type Props = {
  children: Node,
};

const displayName = 'TableRow';

const TableRow = ({ children }: Props) => (
  <tr className={styles.main}>{children}</tr>
);

TableRow.displayName = displayName;

export default TableRow;
