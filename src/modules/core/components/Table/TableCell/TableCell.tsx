import React, { ReactNode, TdHTMLAttributes } from 'react';

interface Props extends TdHTMLAttributes<HTMLTableDataCellElement> {
  className?: string;
  children: ReactNode;
}

const displayName = 'TableCell';

const TableCell = ({ children, ...props }: Props) => (
  <td {...props}>{children}</td>
);

TableCell.displayName = displayName;

export default TableCell;
