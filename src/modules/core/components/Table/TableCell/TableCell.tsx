import React, { ReactNode } from 'react';

// Left intentionally unsealed (passing props)
interface Props {
  className?: string;
  children: ReactNode;
}

const displayName = 'TableCell';

const TableCell = ({ children, ...props }: Props) => (
  <td {...props}>{children}</td>
);

TableCell.displayName = displayName;

export default TableCell;
