import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

const displayName = 'TableRow';

const TableRow = ({
  children,
  ...props
}: DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>) => <tr {...props}>{children}</tr>;

TableRow.displayName = displayName;

export default TableRow;
