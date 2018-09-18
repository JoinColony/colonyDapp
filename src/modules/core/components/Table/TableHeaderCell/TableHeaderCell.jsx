/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, ...props }: Props) => (
  <th {...props}>{children}</th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
