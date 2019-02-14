/* @flow */

import type { MessageDescriptor, FormattedMessageValues } from 'react-intl';

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import type { OpenDialog } from '~components/core/Dialog/types';
import type { UserType } from '~immutable';

import withDialog from '~components/core/Dialog/withDialog';
import { Table, TableBody, TableRow, TableCell } from '~components/core/Table';
import UserAvatar from '~components/core/UserAvatar';
import { unfinishedProfileOpener } from '~components/UnfinishedProfileDialog';
import { withCurrentUser } from '~redux/hocs';

import styles from './InitialTask.css';

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
  currentUser: {
    profile: { balance },
  },
}: Props) => (
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
            <UserAvatar size="xs" walletAddress={walletAddress} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

InitialTask.displayName = displayName;

const enhance = compose(
  withCurrentUser,
  withDialog(),
  withImmutablePropsToJS,
);

export default enhance(InitialTask);
