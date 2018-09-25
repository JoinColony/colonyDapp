/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import Number from '~core/Number';
import { Tooltip } from '~core/Popover';
import UserAvatar from '~core/UserAvatar';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

const displayName = 'dashboard.TaskList.TaskListItem';

type Props = {
  // TODO: type better as soon as actual structure is known
  task: Object,
};

const TaskListItem = ({
  task: { assignee, payouts, reputation, title },
}: Props) => {
  const firstPayout = payouts && payouts[0];
  const extraPayouts = payouts.slice(1);
  return (
    <TableRow>
      <TableCell className={styles.taskDetails}>
        <span className={styles.taskDetailsTitle} title={title}>
          {title}
        </span>
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
        <span className={styles.taskPayout}>
          <Number
            className={styles.taskPayoutNumber}
            value={firstPayout.amount}
            unit="ether"
            decimals={1}
            prefix={`${firstPayout.symbol} `}
          />
        </span>
        {extraPayouts && extraPayouts.length ? (
          <span className={styles.popoverWrapper}>
            <Tooltip
              content={
                <div className={styles.popoverContent}>
                  {extraPayouts.map(payout => (
                    <span key={payout.symbol} className={styles.taskPayout}>
                      <Number
                        className={styles.taskPayoutNumber}
                        value={payout.amount}
                        unit="ether"
                        decimals={1}
                        prefix={`${payout.symbol} `}
                      />
                    </span>
                  ))}
                </div>
              }
            >
              <span className={styles.taskPayoutPopover}>
                +{extraPayouts.length} more
              </span>
            </Tooltip>
          </span>
        ) : null}
      </TableCell>
      <TableCell className={styles.userAvatar}>
        <UserAvatar
          size="xs"
          walletAddress={assignee.walletAddress}
          username={assignee.username}
        />
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

export default TaskListItem;
