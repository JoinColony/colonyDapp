import {
  WrappedComponentProps,
  defineMessages,
  FormattedMessage,
  IntlShape,
  injectIntl,
} from 'react-intl';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import BigNumber from 'bn.js';

import { AnyTask, Payouts } from '~data/index';
import { TableRow, TableCell } from '~core/Table';
import PayoutsList from '~core/PayoutsList';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
  untitled: {
    id: 'dashboard.TaskList.TaskListItem.untitled',
    defaultMessage: 'Untitled task',
  },
});

const UserAvatar = HookedUserAvatar();

interface Props extends WrappedComponentProps {
  intl: IntlShape;
  task: AnyTask;
}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({ task, intl: { formatMessage } }: Props) => {
  const history = useHistory();
  const defaultTitle = formatMessage(MSG.untitled);
  const {
    id: draftId,
    assignedWorkerAddress,
    payouts,
    title = defaultTitle,
    colony: { colonyName, nativeTokenAddress },
  } = task;

  // @todo get reputation from centralized store
  let reputation: BigNumber | undefined;

  const handleClick = useCallback(() => {
    history.push({
      pathname: `/colony/${colonyName}/task/${draftId}`,
    });
  }, [colonyName, draftId, history]);

  return (
    <TableRow className={styles.globalLink} onClick={() => handleClick()}>
      <TableCell className={styles.taskDetails}>
        <p className={styles.taskDetailsTitle}>{title || defaultTitle}</p>
        {!!reputation && (
          <span className={styles.taskDetailsReputation}>
            <FormattedMessage
              {...MSG.reputation}
              values={{ reputation: reputation.toString() }}
            />
          </span>
        )}
      </TableCell>
      <TableCell className={styles.taskPayouts}>
        <PayoutsList
          nativeTokenAddress={nativeTokenAddress}
          payouts={payouts as Payouts}
        />
      </TableCell>
      <TableCell className={styles.userAvatar}>
        {assignedWorkerAddress && (
          <UserAvatar size="s" address={assignedWorkerAddress} />
        )}
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

export default injectIntl(TaskListItem);
