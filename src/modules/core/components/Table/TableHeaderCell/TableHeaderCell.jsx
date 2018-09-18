/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableHeaderCell.css';

type Props = {
  children: Node,
};

const TableHeaderCell = ({ children }: Props) => (
  <th className={styles.main}>{children}</th>
);

export default TableHeaderCell;
