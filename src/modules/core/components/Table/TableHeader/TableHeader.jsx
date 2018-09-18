/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableHeader.css';

type Props = {
  children: Node,
};

const TableHeader = ({ children }: Props) => (
  <thead className={styles.main}>{children}</thead>
);

export default TableHeader;
