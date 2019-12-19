import {
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import BigNumber from 'bn.js';

import { Address } from '~types/index';
import { AnyTask } from '~data/index';
import { TableRow, TableCell } from '~core/Table';
import PayoutsList from '~core/PayoutsList';
import HookedUserAvatar from '~users/HookedUserAvatar';
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
  colonyAddress: Address;
  colonyName: string;
  data: AnyTask;
}

type EnhancerProps = RouteComponentProps & InjectedIntlProps;

interface InnerProps extends Props, EnhancerProps {}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({
  colonyAddress,
  colonyName,
  data,
  intl: { formatMessage },
  history,
}: InnerProps) => {
  const defaultTitle = formatMessage(MSG.untitled);
  const { id: draftId, assignedWorkerAddress, title = defaultTitle } = data;

  // @todo get payouts from centralized store
  const payouts = [];

  // @todo get reputation from centralized store
  let reputation: BigNumber | undefined;

  const nativeTokenRef = useColonyNativeToken(colonyAddress);
  const [, availableTokens] = useColonyTokens(colonyAddress);

  const handleClick = () => {
    history.push({
      pathname: `/colony/${colonyName}/task/${draftId}`,
    });
  };

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
        {!!availableTokens && (
          <PayoutsList
            payouts={payouts}
            nativeToken={nativeTokenRef}
            tokenOptions={availableTokens}
          />
        )}
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
