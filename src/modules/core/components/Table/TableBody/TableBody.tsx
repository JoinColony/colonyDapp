import React, { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

const displayName = 'TableBody';

const TableBody = ({ children, ...props }: Props) => (
  <tbody {...props}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
