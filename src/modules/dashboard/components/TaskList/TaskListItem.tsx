import {
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import React, { useCallback } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import BigNumber from 'bn.js';

import { AnyTask } from '~data/index';
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

type EnhancerProps = RouteComponentProps & InjectedIntlProps;

interface Props extends EnhancerProps {
  task: AnyTask;
}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({ task, intl: { formatMessage }, history }: Props) => {
  const defaultTitle = formatMessage(MSG.untitled);
  const {
    id: draftId,
    assignedWorkerAddress,
    title = defaultTitle,
    colony: { colonyName, displayName, nativeTokenAddress },
  } = task;

  // FIXME get payouts from task
  const payouts = [];
  // FIXME get tokens from colony
  const tokens = [];

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
          payouts={payouts}
          tokens={tokens}
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

const enhance = compose<EnhancerProps, Props>(
  withRouter,
  injectIntl,
);

export default enhance(TaskListItem);
