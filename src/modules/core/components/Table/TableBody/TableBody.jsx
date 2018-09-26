/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import styles from './TableBody.css';

type Props = {
  children: ChildrenArray<ElementType<*>>,
};

const displayName = 'TableBody';

const TableBody = ({ children, ...props }: Props) => (
  <tbody className={styles.main} {...props}>
    {children}
  </tbody>
);

TableBody.displayName = displayName;

export default TableBody;
