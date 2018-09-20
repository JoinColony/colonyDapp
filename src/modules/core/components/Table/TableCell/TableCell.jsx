/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
  width?: string,
};

const displayName = 'TableCell';

const TableCell = ({ children, width, ...props }: Props) => (
  <td style={{ width }} {...props}>
    {children}
  </td>
);

TableCell.displayName = displayName;

export default TableCell;
