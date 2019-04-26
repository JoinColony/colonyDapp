/* @flow */

import type { MessageDescriptor, FormattedMessageValues } from 'react-intl';

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { Table, TableBody, TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { CREATE_USER_ROUTE } from '~routes';

import styles from './InitialTask.css';

const UserAvatar = HookedUserAvatar();

export type InitialTaskType = {
  title: MessageDescriptor,
  titleValues?: FormattedMessageValues,
  walletAddress: string,
};

// Can't seal this object because of withConsumerFactory
type Props = {
  task: InitialTaskType,
};

const displayName = 'dashboard.Dashboard.InitialTask';

const InitialTask = ({
  task: { title, titleValues, walletAddress },
}: Props) => (
  <div className={styles.main}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={styles.taskDetails}>
            <NavLink className={styles.taskDetailsTitle} to={CREATE_USER_ROUTE}>
              <FormattedMessage {...title} values={titleValues} />
            </NavLink>
          </TableCell>
          <TableCell className={styles.userAvatar}>
            <UserAvatar size="xs" address={walletAddress} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

InitialTask.displayName = displayName;

export default InitialTask;
