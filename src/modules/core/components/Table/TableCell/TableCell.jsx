/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableCell.css';

type Props = {
  children: Node,
};

const TableCell = ({ children }: Props) => (
  <td className={styles.main}>{children}</td>
);

export default TableCell;
