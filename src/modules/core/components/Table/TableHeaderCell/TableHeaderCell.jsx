/* @flow */
import type { Node } from 'react';

import React from 'react';

// Left intentionally unsealed (passing props)
type Props = {
  children: Node,
};

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, ...props }: Props) => (
  <th {...props}>{children}</th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
