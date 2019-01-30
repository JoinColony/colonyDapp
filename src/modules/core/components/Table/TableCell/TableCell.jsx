/* @flow */
import type { Node } from 'react';

import React from 'react';

// Left intentionally unsealed (passing props)
type Props = {
  children: Node,
};

const displayName = 'TableCell';

const TableCell = ({ children, ...props }: Props) => (
  <td {...props}>{children}</td>
);

TableCell.displayName = displayName;

export default TableCell;
