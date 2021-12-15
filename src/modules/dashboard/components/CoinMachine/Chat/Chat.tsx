import React, { useLayoutEffect, useRef, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Comment, { CommentInput } from '~core/Comment';
import { MiniSpinnerLoader } from '~core/Preloaders';
import {
  Colony,
  useCommentsSubscription,
  useLoggedInUser,
  useCoinMachineHasWhitelistQuery,
  useUserWhitelistStatusQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import { commentTransformer } from '../../../transformers';
import { getAllUserRoles } from '../../../../transformers';
import { hasRoot, canAdminister } from '../../../../users/checks';

import styles from './Chat.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.CoinMachine.Chat.emptyText',
    defaultMessage: 'Nobody’s said anything yet... 😢',
  },
  disabledText: {
    id: 'dashboard.CoinMachine.Chat.disabledText',
    defaultMessage: 'Chat is disabled until the Token Sale is ready to start',
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
  mustWhitelistToComment: {
    id: 'dashboard.CoinMachine.Chat.mustWhitelistToComment',
    defaultMessage: 'You must be whitelisted to chat',
  },
});

interface Props {
  colony: Colony;
  transactionHash: string;
  disabled?: boolean;
  limit?: number;
}

const displayName = 'dashboard.CoinMachine.Chat';

const Chat = ({
  colony,
  colony: { colonyAddress },
  transactionHash,
  disabled,
  limit = 100,
}: Props) => {
  const scrollElmRef = useRef<HTMLDivElement | null>(null);

  const { walletAddress, username, ethereal } = useLoggedInUser();
  const userHasProfile = !!username && !ethereal;

  const {
    data: whitelistState,
    loading: loadingCoinMachineWhitelistState,
  } = useCoinMachineHasWhitelistQuery({
    variables: { colonyAddress },
  });
  const isWhitelistExtensionEnabled =
    whitelistState?.coinMachineHasWhitelist || false;

  const {
    data: userWhitelistStatusData,
    loading: userStatusLoading,
  } = useUserWhitelistStatusQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    skip: !isWhitelistExtensionEnabled,
  });

  const isUserWhitelisted =
    userWhitelistStatusData?.userWhitelistStatus?.userIsWhitelisted;
  const canUserComment = isWhitelistExtensionEnabled ? isUserWhitelisted : true;

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const canAdministerComments =
    userHasProfile && (hasRoot(allUserRoles) || canAdminister(allUserRoles));
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
    variables: { transactionHash, limit },
  });

  /*
   * This triggers after every new comment was made
   */
  useLayoutEffect(scrollComments, [scrollComments]);

  const filteredComments = useMemo(() => {
    const comments = data?.transactionMessages?.messages || [];
    return commentTransformer(comments, walletAddress, canAdministerComments);
  }, [canAdministerComments, data, walletAddress]);

  if (loading || loadingCoinMachineWhitelistState || userStatusLoading) {
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
          {filteredComments?.length ? (
            filteredComments.map(
              ({ createdAt, initiator, context, sourceId }) => {
                const { message, deleted, adminDelete, userBanned } = context;
                return (
                  <Comment
                    key={`${initiator}.${createdAt}`}
                    createdAt={createdAt}
                    comment={message}
                    user={initiator}
                    colony={colony}
                    commentMeta={{
                      id: sourceId,
                      deleted,
                      adminDelete,
                      userBanned,
                    }}
                    showControls
                  />
                );
              },
            )
          ) : (
            <div className={styles.empty}>
              {disabled ? (
                <FormattedMessage {...MSG.disabledText} />
              ) : (
                <FormattedMessage {...MSG.emptyText} />
              )}
            </div>
          )}
        </div>
        <div ref={scrollElmRef} />
      </div>
      {!disabled && (
        <div className={styles.inputBox}>
          <CommentInput
            colonyAddress={colony.colonyAddress}
            transactionHash={transactionHash}
            callback={scrollComments}
            disabled={disabled || !userHasProfile || !canUserComment}
            disabledInputPlaceholder={
              !canUserComment ? MSG.mustWhitelistToComment : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

Chat.displayName = displayName;

export default Chat;
