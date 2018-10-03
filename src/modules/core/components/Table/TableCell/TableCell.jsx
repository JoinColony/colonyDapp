/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const displayName = 'TableCell';

const TableCell = ({ children, ...props }: Props) => (
  <td {...props}>{children}</td>
);

TableCell.displayName = displayName;

export default TableCell;
