/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

type Props = {
  children: ChildrenArray<ElementType<*>>,
};

const displayName = 'TableBody';

const TableBody = ({ children, ...props }: Props) => (
  <tbody {...props}>{children}</tbody>
);

TableBody.displayName = displayName;

export default TableBody;
