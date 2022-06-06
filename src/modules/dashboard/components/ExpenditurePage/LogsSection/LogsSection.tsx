import React, { useMemo } from 'react';

import styles from './LogsSection.css';
import { logs, colony } from './consts';
import Log from './Log';
import { useLoggedInUser } from '~data/helpers';
import Comment, { CommentInput } from '~core/Comment';
import { Colony } from '~data/index';

interface Props {
  colonyAddress: string;
}

const LogsSection = ({ colonyAddress }: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();
  // add logs fetching here

  const renderLogs = useMemo(() => {
    return logs.map((log) => {
      if (log.type === 'action' && log.actionType) {
        return <Log {...log} key={log.uniqueId} />;
      }
      const {
        createdAt,
        message,
        sourceId,
        deleted,
        adminDelete,
        userBanned,
        initiator,
      } = log;
      if (log.type === 'comment') {
        return (
          <div className={styles.comment}>
            <Comment
              key={log.uniqueId}
              createdAt={createdAt}
              comment={message}
              commentMeta={{
                id: sourceId || '',
                deleted,
                adminDelete,
                userBanned,
              }}
              colony={(colony as unknown) as Colony}
              user={initiator}
              showControls
            />
          </div>
        );
      }
      return null;
    });
  }, []);

  return (
    <div className={styles.container}>
      {renderLogs}
      {/*
       *  @NOTE A user can comment only if he has a wallet connected
       * and a registered user profile
       */}
      {currentUserName && !ethereal && (
        <div className={styles.commentInput}>
          <CommentInput
            {...{
              colonyAddress,
              transactionHash:
                // eslint-disable-next-line max-len
                '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LogsSection;
