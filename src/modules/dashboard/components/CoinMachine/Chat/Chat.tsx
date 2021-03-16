import React, { useEffect, useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import FeedItem from '~core/FeedItem';
import CommentInput from '~core/CommentInput';

import {
  useLoggedInUser,
  TransactionMessageFragment,
  Colony,
} from '~data/index';

import styles from './Chat.css';

const MSG = defineMessages({
  emptyText: {
    id: 'Chat.emptyText',
    defaultMessage: 'Nobody’s said anything yet... 😢',
  },
  labelLeaveComment: {
    id: 'Chat.labelLeaveComment',
    defaultMessage: 'Leave a comment',
  },
  loginToComment: {
    id: 'Chat.loginToComment',
    defaultMessage: 'Login to comment',
  },
});

interface Props {
  comments: Array<TransactionMessageFragment>;
  colony: Colony;
  transactionHash: string;
}

const displayName = 'Chat';

const Chat = ({
  comments,
  colony: { colonyAddress },
  transactionHash,
}: Props) => {
  const { username, ethereal } = useLoggedInUser();
  const scrollElmRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollElmRef.current) {
      scrollElmRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <div className={styles.main}>
      <div className={styles.messages}>
        {comments && comments.length ? (
          comments.map(({ createdAt, initiator, context }) => (
            <FeedItem
              key={`${initiator}.${createdAt}`}
              createdAt={createdAt}
              comment={context.message}
              user={initiator}
            />
          ))
        ) : (
          <FormattedMessage {...MSG.emptyText} />
        )}
        <div ref={scrollElmRef} />
      </div>
      <div className={styles.inputBox}>
        {username && !ethereal && (
          <CommentInput
            colonyAddress={colonyAddress}
            transactionHash={transactionHash}
          />
        )}
      </div>
    </div>
  );
};

Chat.displayName = displayName;

export default Chat;
