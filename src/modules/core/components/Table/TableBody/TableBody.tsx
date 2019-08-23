import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const displayName = 'TableBody';

const TableBody = ({ children, ...props }: Props) => (
  <tbody {...props}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
