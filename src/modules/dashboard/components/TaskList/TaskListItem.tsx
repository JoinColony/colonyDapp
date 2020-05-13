import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers/utils';

import Icon from '~core/Icon';
import { AbbreviatedNumeral } from '~core/Numeral';
import PayoutsList from '~core/PayoutsList';
import { TableRow, TableCell } from '~core/Table';
import { AnyTask, Payouts } from '~data/index';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
  titleCommentCount: {
    id: 'dashboard.TaskList.TaskListItem.titleCommentCount',
    defaultMessage: `{formattedCommentCount} {commentCount, plural,
      one {comment}
      other {comments}
    }`,
  },
});

const UserAvatar = HookedUserAvatar();

interface Props {
  task: AnyTask;
}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({ task }: Props) => {
  const history = useHistory();
  const { formatMessage, formatNumber } = useIntl();

  const defaultTitle = formatMessage({ id: 'task.untitled' });
  const {
    id: draftId,
    assignedWorkerAddress,
    commentCount,
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
        <div>
          <p className={styles.taskDetailsTitle}>{title || defaultTitle}</p>
        </div>
        {!!(reputation || commentCount) && (
          <div className={styles.extraInfo}>
            {!!reputation && (
              <div className={styles.extraInfoItem}>
                <span className={styles.taskDetailsReputation}>
                  <FormattedMessage
                    {...MSG.reputation}
                    values={{ reputation: reputation.toString() }}
                  />
                </span>
              </div>
            )}
            {commentCount && (
              <div className={styles.commentCountItem}>
                <Icon
                  appearance={{ size: 'extraTiny' }}
                  className={styles.commentCountIcon}
                  name="comment"
                  title={formatMessage(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: formatNumber(commentCount),
                  })}
                />
                <AbbreviatedNumeral
                  formatOptions={{
                    notation: 'compact',
                  }}
                  value={commentCount}
                  title={formatMessage(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: formatNumber(commentCount),
                  })}
                />
              </div>
            )}
          </div>
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
          <UserAvatar size="s" address={assignedWorkerAddress} notSet={false} />
        )}
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

export default TaskListItem;
