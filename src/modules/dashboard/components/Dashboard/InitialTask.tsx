import {
  MessageDescriptor,
  FormattedMessageValues,
  FormattedMessage,
} from 'react-intl';
import React from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import unfinishedProfileOpener from '~users/UnfinishedProfile';
import { Table, TableBody, TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';
import styles from './InitialTask.css';

const UserAvatar = HookedUserAvatar();

export interface InitialTaskType {
  title: MessageDescriptor;
  titleValues?: FormattedMessageValues;
  walletAddress: string;
}

interface Props {
  task: InitialTaskType;
  history: any;
}

const displayName = 'dashboard.Dashboard.InitialTask';

const InitialTask = ({
  task: { title, titleValues, walletAddress },
  history,
}: Props) => (
  <div className={styles.main}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={styles.taskDetails}>
            <button
              className={styles.taskDetailsTitle}
              type="button"
              onClick={() => unfinishedProfileOpener(history)}
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

InitialTask.displayName = displayName;

const enhance = compose(withRouter) as any;

export default enhance(InitialTask);
