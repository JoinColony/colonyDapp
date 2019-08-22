import {
  IntlShape,
  defineMessages,
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import React from 'react';

import { Address, ENSName } from '~types/index';
import { TaskPayoutType, TaskType } from '~immutable/index';
import { useDataFetcher } from '~utils/hooks';
import { colonyNameFetcher } from '../../fetchers';
import { TableRow, TableCell } from '~core/Table';
import PayoutsList from '~core/PayoutsList';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';
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

const displayName = 'dashboard.TaskList.TaskListItem';

interface Props {
  data: {
    key: string;
    entry: [Address, string];
    data: TaskType | void;
    isFetching: boolean;
    error: boolean;
  };
  intl: IntlShape;
}

const TaskListItem = ({ data, intl: { formatMessage } }: Props) => {
  const {
    data: task,
    entry: [colonyAddress, draftId],
    isFetching: isFetchingTask,
  } = data;
  const defaultTitle = formatMessage(MSG.untitled);
  const {
    workerAddress = undefined,
    payouts = [],
    reputation = undefined,
    title = defaultTitle,
  } = task || {};

  const { data: colonyName, isFetching: isFetchingColonyName } = useDataFetcher<
    ENSName
  >(colonyNameFetcher, [colonyAddress], [colonyAddress]);

  const nativeTokenRef = useColonyNativeToken(colonyAddress);
  const [, availableTokens] = useColonyTokens(colonyAddress);

  if (!task || !colonyName || isFetchingTask || isFetchingColonyName) {
    return (
      <TableRow>
        <TableCell className={styles.taskDetails}>
          <SpinnerLoader />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Link
      className={styles.globalLink}
      to={`/colony/${colonyName}/task/${draftId}`}
    >
      <TableRow>
        <TableCell className={styles.taskDetails}>
          <p className={styles.taskDetailsTitle}>{title || defaultTitle}</p>
          {reputation && (
            <span className={styles.taskDetailsReputation}>
              <FormattedMessage
                {...MSG.reputation}
                values={{ reputation: reputation.toString() }}
              />
            </span>
          )}
        </TableCell>
        <TableCell className={styles.taskPayouts}>
          {!!availableTokens && (
            <PayoutsList
              payouts={payouts}
              nativeToken={nativeTokenRef}
              tokenOptions={availableTokens}
            />
          )}
        </TableCell>
        <TableCell className={styles.userAvatar}>
          {workerAddress && <UserAvatar size="xs" address={workerAddress} />}
        </TableCell>
      </TableRow>
    </Link>
  );
};

TaskListItem.displayName = displayName;

export default injectIntl(TaskListItem);
