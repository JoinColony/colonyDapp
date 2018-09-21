/* @flow */
import type { Node } from 'react';

import React from 'react';

import { TableRow, TableCell } from '~core/Table';

type Props = {
  children: Node,
};

const ActivityFeedItem = ({ children }: Props) => (
  <TableRow>
    <TableCell padding="20px 40px">{children}</TableCell>
  </TableRow>
);

export default ActivityFeedItem;
