/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

type Props = {
  children: ChildrenArray<ElementType<*>>,
};

const displayName = 'TableRow';

const TableRow = ({ children, ...props }: Props) => (
  <tr {...props}>{children}</tr>
);

TableRow.displayName = displayName;

export default TableRow;
