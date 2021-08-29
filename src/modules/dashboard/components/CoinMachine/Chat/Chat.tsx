import React, { useLayoutEffect, useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Comment from '~core/Comment';
import CommentInput from '~core/CommentInput';
import { MiniSpinnerLoader } from '~core/Preloaders';

import { Colony, useCommentsSubscription, useLoggedInUser } from '~data/index';

import styles from './Chat.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.CoinMachine.Chat.emptyText',
    defaultMessage: 'Nobody’s said anything yet... 😢',
  },
  labelLeaveComment: {
    id: 'dashboard.CoinMachine.Chat.labelLeaveComment',
    defaultMessage: 'Leave a comment',
  },
  loginToComment: {
    id: 'dashboard.CoinMachine.Chat.loginToComment',
    defaultMessage: 'Login to comment',
  },
  loading: {
    id: 'dashboard.CoinMachine.Chat.loading',
    defaultMessage: 'Loading messages',
  },
});

interface Props {
  colony: Colony;
  transactionHash: string;
}

const displayName = 'dashboard.CoinMachine.Chat';

const Chat = ({ colony: { colonyAddress }, transactionHash }: Props) => {
  const scrollElmRef = useRef<HTMLDivElement | null>(null);

  const { username, ethereal } = useLoggedInUser();
  const userHasProfile = !!username && !ethereal;

  /*
   * @NOTE This is needed in order to make the scroll effect trigger after
   * each new comment was made, otherwise it will use React's internal cache
   * and will always be one comment behind
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollComments = () => {
    if (scrollElmRef.current) {
      scrollElmRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /*
   * This is used for the first render, so we have to (fake) wait for the
   * compoenent to mount, and for this we make the user of setTimeout
   */
  useLayoutEffect(() => {
    setTimeout(scrollComments, 0);
  }, [scrollComments]);

  const { data, loading } = useCommentsSubscription({
    variables: { transactionHash },
  });

  /*
   * This triggers after every new comment was made
   */
  useLayoutEffect(scrollComments, [scrollComments]);

  if (loading) {
    return (
      <div className={styles.main}>
        <div className={styles.messages}>
          <MiniSpinnerLoader
            className={styles.loading}
            loadingTextClassName={styles.loaderMessage}
            loadingText={MSG.loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.messages}>
        <div>
          {data?.transactionMessages?.messages &&
          data?.transactionMessages?.messages?.length ? (
            data?.transactionMessages?.messages.map(
              ({ createdAt, initiator, context }) => (
                <Comment
                  key={`${initiator}.${createdAt}`}
                  createdAt={createdAt}
                  comment={context.message}
                  user={initiator}
                />
              ),
            )
          ) : (
            <div className={styles.empty}>
              <FormattedMessage {...MSG.emptyText} />
            </div>
          )}
        </div>
        <div ref={scrollElmRef} />
      </div>
      <div className={styles.inputBox}>
        <CommentInput
          colonyAddress={colonyAddress}
          transactionHash={transactionHash}
          callback={scrollComments}
          disabled={!userHasProfile}
          disabledInputPlaceholder
        />
      </div>
    </div>
  );
};

Chat.displayName = displayName;

export default Chat;
