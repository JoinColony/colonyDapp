/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import TableCell from '../TableCell';
import TableHeaderCell from '../TableHeaderCell';

type ValidCell = typeof TableCell | typeof TableHeaderCell;

type Props = {
  children: ChildrenArray<ElementType<ValidCell>>,
};

const displayName = 'TableRow';

const TableRow = ({ children, ...props }: Props) => (
  <tr {...props}>{children}</tr>
);

TableRow.displayName = displayName;

export default TableRow;
