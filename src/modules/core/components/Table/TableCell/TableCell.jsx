/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const displayName = 'TableCell';

const TableCell = ({ children }: Props) => <td>{children}</td>;

TableCell.displayName = displayName;

export default TableCell;
