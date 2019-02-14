/* @flow */
import type { Node } from 'react';

import React from 'react';

// Left intentionally unsealed (passing props)
type Props = {
  children: Node,
};

const displayName = 'TableBody';

const TableBody = ({ children, ...props }: Props) => (
  <tbody {...props}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
