import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  useMessageContext,
} from 'stream-chat-react';
import { defineMessages } from 'react-intl';

import Comment from '~core/Comment';
import { MiniSpinnerLoader } from '~core/Preloaders';

import { useLoggedInUser, AnyUser } from '~data/index';
import StreamCommentInput from './CommentInput';

import styles from './UserProfileComments.css';

interface Props {
  user: AnyUser;
}

const MSG = defineMessages({
  loading: {
    id: 'users.UserProfileComments.loading',
    defaultMessage: 'Loading messages',
  },
});

const displayName = 'users.UserProfileComments';

const UserProfileComments = ({
  user: {
    profile: {
      walletAddress,
      username: userUsername,
      displayName: userDisplayName,
    },
  },
}: Props) => {
  const { username, ethereal } = useLoggedInUser();

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  // @ts-ignore
  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('f7vp3aeqw6wq');

      if (!ethereal && username) {
        await client.connectUser(
          {
            id: walletAddress,
            username: userUsername as string,
            name: userDisplayName || userUsername || walletAddress,
          },
          client.devToken(walletAddress),
        );
      } else {
        await client.connectAnonymousUser();
      }
      setChatClient(client);
    };

    initChat();

    return () => chatClient?.disconnectUser();
  }, [
    chatClient,
    ethereal,
    userDisplayName,
    userUsername,
    username,
    walletAddress,
  ]);

  const CustomMessage = () => {
    const { message } = useMessageContext();
    const { user: userFromMessage, id, text } = message;

    return (
      <Comment
        key={id}
        // eslint-disable-next-line camelcase
        createdAt={new Date(message?.created_at || 'now')}
        comment={text}
        user={{
          id: userFromMessage?.id || '',
          profile: {
            username: userFromMessage?.username,
            walletAddress: userFromMessage?.id || '',
            displayName: userFromMessage?.name,
          },
        }}
        showControls={false}
      />
    );
  };

  if (!chatClient) {
    return <MiniSpinnerLoader loadingText={MSG.loading} />;
  }

  const channel = chatClient.channel('user-cdapp-test', walletAddress);

  return (
    <div className={styles.main}>
      <Chat client={chatClient}>
        <Channel channel={channel} DateSeparator={() => null}>
          <MessageList Message={CustomMessage} />
          <div className={styles.controls}>
            <StreamCommentInput
              channel={channel}
              disabled={ethereal || !username}
            />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

UserProfileComments.displayName = displayName;

export default UserProfileComments;
