/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableBody.css';

type Props = {
  children: Node,
};

const displayName = 'TableBody';

const TableBody = ({ children }: Props) => (
  <tbody className={styles.main}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
