/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
  padding?: string,
  width?: string,
};

const displayName = 'TableCell';

const TableCell = ({ children, padding, width, ...props }: Props) => (
  <td style={{ padding, width }} {...props}>
    {children}
  </td>
);

TableCell.displayName = displayName;

export default TableCell;
