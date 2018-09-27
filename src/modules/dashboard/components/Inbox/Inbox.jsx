/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';

type Props = {
  // TODO: type better as soon as actual structure is known
  tasks: Array<Object>,
};

const Inbox = ({ tasks }: Props) => (
  <Table scrollable>
    <TableBody />
  </Table>
);

export default Inbox;
