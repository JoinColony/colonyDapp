/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children }: Props) => <th>{children}</th>;

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
