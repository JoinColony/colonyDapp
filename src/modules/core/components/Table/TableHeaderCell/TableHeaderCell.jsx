/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
  padding?: string,
  width?: string,
};

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, padding, width, ...props }: Props) => (
  <th style={{ padding, width }} {...props}>
    {children}
  </th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
