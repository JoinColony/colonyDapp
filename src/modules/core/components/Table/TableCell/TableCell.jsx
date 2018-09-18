/* @flow */
import type { Node } from 'react';

import React from 'react';

type Props = {
  children: Node,
};

const TableCell = ({ children }: Props) => <td>{children}</td>;

export default TableCell;
