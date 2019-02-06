/* @flow */

import type { MessageDescriptor, FormattedMessageValues } from 'react-intl';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';

import withDialog from '~core/Dialog/withDialog';
import { Table, TableBody, TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import styles from './InitialTask.css';

export type InitialTaskType = {
  title: MessageDescriptor,
  titleValues?: FormattedMessageValues,
  walletAddress: string,
};

type Props = {
  task: InitialTaskType,
  openDialog: OpenDialog,
};

const displayName = 'dashboard.Dashboard.InitialTask';

const InitialTask = ({
  task: { title, titleValues, walletAddress },
  openDialog,
}: Props) => (
  <div className={styles.main}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={styles.taskDetails}>
            <button
              className={styles.taskDetailsTitle}
              type="button"
              onClick={() =>
                openDialog('UnfinishedProfileDialog')
                  .afterClosed()
                  .then(() =>
                    openDialog('ClaimProfileDialog')
                      .afterClosed()
                      .then(() => openDialog('ENSNameDialog'))
                      .catch(err => {
                        // eslint-disable-next-line no-console
                        console.log(err);
                      }),
                  )
              }
            >
              <FormattedMessage {...title} values={titleValues} />
            </button>
          </TableCell>
          <TableCell className={styles.userAvatar}>
            <UserAvatar size="xs" walletAddress={walletAddress} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

InitialTask.displayName = displayName;

export default withDialog()(InitialTask);
