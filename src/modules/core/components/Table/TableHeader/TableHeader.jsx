/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './TableHeader.css';

type Props = {
  children: Node,
};

const displayName = 'TableHeader';

const TableHeader = ({ children }: Props) => (
  <thead className={styles.main}>{children}</thead>
);

TableHeader.displayName = displayName;

export default TableHeader;
