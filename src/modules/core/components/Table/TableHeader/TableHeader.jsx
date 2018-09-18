/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import styles from './TableHeader.css';

import TableRow from '../TableRow';

type Props = {
  children: ChildrenArray<ElementType<typeof TableRow>>,
};

const displayName = 'TableHeader';

const TableHeader = ({ children }: Props) => (
  <thead className={styles.main}>{children}</thead>
);

TableHeader.displayName = displayName;

export default TableHeader;
