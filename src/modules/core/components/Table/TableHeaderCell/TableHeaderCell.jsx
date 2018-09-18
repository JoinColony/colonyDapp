/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const TableHeaderCell = ({ children }: Props) => <th>{children}</th>;

export default TableHeaderCell;
