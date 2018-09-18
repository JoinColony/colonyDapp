/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableRow.css';

type Props = {
  children: Node,
};

const TableRow = ({ children }: Props) => (
  <tr className={styles.main}>{children}</tr>
);

export default TableRow;
