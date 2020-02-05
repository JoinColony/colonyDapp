import { MessageDescriptor, FormattedMessage } from 'react-intl';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Table, TableBody, TableRow, TableCell } from '~core/Table';
import { ComplexMessageValues } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import unfinishedProfileOpener from '~users/UnfinishedProfile';

import styles from './InitialTask.css';
import taskListItemStyles from '../TaskList/TaskListItem.css';

const UserAvatar = HookedUserAvatar();

export interface InitialTaskType {
  title: MessageDescriptor;
  titleValues?: ComplexMessageValues;
  walletAddress: string;
}

interface Props {
  task: InitialTaskType;
}

const displayName = 'dashboard.Dashboard.InitialTask';

const InitialTask = ({
  task: { title, titleValues, walletAddress },
}: Props) => {
  const history = useHistory();
  return (
    <div className={styles.main}>
      <Table appearance={{ theme: 'rounder' }}>
        <TableBody>
          <TableRow>
            <TableCell className={styles.taskDetails}>
              <button
                className={styles.callToAction}
                type="button"
                data-test="createColony"
                onClick={() => unfinishedProfileOpener(history)}
              >
                <FormattedMessage {...title} values={titleValues} />
              </button>
            </TableCell>
            <TableCell className={taskListItemStyles.userAvatar}>
              <UserAvatar size="s" address={walletAddress} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

InitialTask.displayName = displayName;

export default InitialTask;
