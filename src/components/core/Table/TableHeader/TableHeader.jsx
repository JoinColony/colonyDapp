/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import styles from './TableHeader.css';

// Left intentionally unsealed (passing props)
type Props = {
  children: ChildrenArray<ElementType<*>>,
};

const displayName = 'TableHeader';

const TableHeader = ({ children, ...props }: Props) => (
  <thead className={styles.main} {...props}>
    {children}
  </thead>
);

TableHeader.displayName = displayName;

export default TableHeader;
