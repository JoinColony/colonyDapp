import React from 'react';

import { TableRow, TableCell } from '~core/Table';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  item: any;
  handleOnClick?: () => void;
}

const ActionsListItem = ({ item, handleOnClick }: Props) => (
  <TableRow className={styles.main} onClick={handleOnClick}>
    <TableCell>{item.userAddress}</TableCell>
    <TableCell>{item.title}</TableCell>
    <TableCell>{item.eventTopic}</TableCell>
    <TableCell>{item.date}</TableCell>
    <TableCell>{item.domain}</TableCell>
    <TableCell>{item.commentCount}</TableCell>
    <TableCell>{item.status}</TableCell>
    {/* <TableCell className={styles.taskDetails}>
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
    </TableCell> */}
  </TableRow>
);

ActionsListItem.displayName = displayName;

export default ActionsListItem;
