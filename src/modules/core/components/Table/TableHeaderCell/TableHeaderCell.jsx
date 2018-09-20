/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
  width?: string,
};

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, width, ...props }: Props) => (
  <th style={{ width }} {...props}>
    {children}
  </th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
