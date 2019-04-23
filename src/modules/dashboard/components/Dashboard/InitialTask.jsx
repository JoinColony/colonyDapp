/* @flow */

import type { MessageDescriptor, FormattedMessageValues } from 'react-intl';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import type { OpenDialog } from '~core/Dialog/types';
import type { UserType } from '~immutable';

import { useSelector } from '~utils/hooks';

import withDialog from '~core/Dialog/withDialog';
import { Table, TableBody, TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';

import { currentUserBalanceSelector } from '../../../users/selectors';

import styles from './InitialTask.css';

const UserAvatar = HookedUserAvatar();

export type InitialTaskType = {
  title: MessageDescriptor,
  titleValues?: FormattedMessageValues,
  walletAddress: string,
};

// Can't seal this object because of withConsumerFactory
type Props = {
  currentUser: UserType,
  openDialog: OpenDialog,
  task: InitialTaskType,
};

const displayName = 'dashboard.Dashboard.InitialTask';

const InitialTask = ({
  task: { title, titleValues, walletAddress },
  openDialog,
}: Props) => {
  const balance = useSelector(currentUserBalanceSelector);
  return (
    <div className={styles.main}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={styles.taskDetails}>
              <button
                className={styles.taskDetailsTitle}
                type="button"
                onClick={() => unfinishedProfileOpener(openDialog, balance)}
              >
                <FormattedMessage {...title} values={titleValues} />
              </button>
            </TableCell>
            <TableCell className={styles.userAvatar}>
              <UserAvatar size="xs" address={walletAddress} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

InitialTask.displayName = displayName;

export default withDialog()(InitialTask);
