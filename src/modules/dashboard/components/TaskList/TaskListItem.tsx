import {
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import { Address } from '~types/index';
import { TaskType } from '~immutable/index';
import { useDataFetcher } from '~utils/hooks';
import { colonyNameFetcher } from '../../fetchers';
import { TableRow, TableCell } from '~core/Table';
import PayoutsList from '~core/PayoutsList';
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

interface Props {
  data: {
    key: string;
    entry: [Address, string];
    data: TaskType | void;
    isFetching: boolean;
    error: boolean;
  };
}

type EnhancerProps = RouteComponentProps & InjectedIntlProps;

interface InnerProps extends Props, EnhancerProps {}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({
  data,
  intl: { formatMessage },
  history,
}: InnerProps) => {
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

  const { data: colonyName, isFetching: isFetchingColonyName } = useDataFetcher(
    colonyNameFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const nativeTokenRef = useColonyNativeToken(colonyAddress);
  const [, availableTokens] = useColonyTokens(colonyAddress);

  if (!task || !colonyName || isFetchingTask || isFetchingColonyName) {
    return (
      <TableRow>
        <TableCell className={styles.taskLoading}>
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </TableCell>
      </TableRow>
    );
  }

  const handleClick = () => {
    history.push({
      pathname: `/colony/${colonyName}/task/${draftId}`,
    });
  };

  return (
    <TableRow className={styles.globalLink} onClick={() => handleClick()}>
      <TableCell className={styles.taskDetails}>
        <p className={styles.taskDetailsTitle}>{title || defaultTitle}</p>
        {reputation ? (
          <span className={styles.taskDetailsReputation}>
            <FormattedMessage
              {...MSG.reputation}
              values={{ reputation: reputation.toString() }}
            />
          </span>
        ) : null}
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
        {workerAddress && <UserAvatar size="s" address={workerAddress} />}
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

const enhance = compose<EnhancerProps, Props>(
  withRouter,
  injectIntl,
);

export default enhance(TaskListItem);
