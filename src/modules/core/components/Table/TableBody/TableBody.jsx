/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import styles from './TableBody.css';

import TableRow from '../TableRow';

type Props = {
  children: ChildrenArray<ElementType<typeof TableRow>>,
};

const displayName = 'TableBody';

const TableBody = ({ children }: Props) => (
  <tbody className={styles.main}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
