import React, { HTMLAttributes } from 'react';

const displayName = 'TableRow';

const TableRow = ({ children, ...props }: HTMLAttributes<any>) => (
  <tr {...props}>{children}</tr>
);

TableRow.displayName = displayName;

export default TableRow;
