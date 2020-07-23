import React, { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableHeaderCellElement> {
  className?: string;
  children: ReactNode;
}

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, ...props }: Props) => (
  <th {...props}>{children}</th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
