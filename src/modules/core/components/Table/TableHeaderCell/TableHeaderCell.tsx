import React, { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

const displayName = 'TableHeaderCell';

const TableHeaderCell = ({ children, ...props }: Props) => (
  <th {...props}>{children}</th>
);

TableHeaderCell.displayName = displayName;

export default TableHeaderCell;
