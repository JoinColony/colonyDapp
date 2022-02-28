import React, { useEffect, useState } from 'react';
import { Channel as ChannelType } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  useMessageContext,
} from 'stream-chat-react';
import { defineMessages } from 'react-intl';

import Comment from '~core/Comment';
import { MiniSpinnerLoader } from '~core/Preloaders';

import { ContextModule, TEMP_getContext } from '~context/index';
import { useLoggedInUser } from '~data/index';

import StreamCommentInput from './CommentInput';

import styles from './UserProfileComments.css';

interface Props {
  channelId: string;
}

const MSG = defineMessages({
  loading: {
    id: 'users.UserProfileComments.loading',
    defaultMessage: 'Loading messages',
  },
});

const displayName = 'users.UserProfileComments';

const STREAM_CHANNEL_TYPE = 'user-cdapp-test';

const UserProfileComments = ({ channelId }: Props) => {
  const {
    username,
    ethereal,
    walletAddress: userWalletAddress,
  } = useLoggedInUser();

  const chatClient = TEMP_getContext(ContextModule.ChatClient);
  const [channel, setChannel] = useState<ChannelType | null>(null);

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

  useEffect(() => {
    const getChannel = () => chatClient.channel(STREAM_CHANNEL_TYPE, channelId);
    const interval = setInterval(async () => {
      if (!ethereal && username) {
        if (chatClient.user) {
          if (chatClient.user?.id !== userWalletAddress) {
            await chatClient.disconnectUser();
            setChannel(null);
            await chatClient.connectUser(
              {
                id: userWalletAddress,
                username: username as string,
                name: username || userWalletAddress,
              },
              chatClient.devToken(userWalletAddress),
            );
            clearInterval(interval);
            setChannel(getChannel());
          } else {
            clearInterval(interval);
            setChannel(getChannel());
          }
        }
      } else if (!chatClient.user?.anon) {
        /*
         * @NOTE This case should actually disconnect the current user
         * and log back the anon user
         */
        clearInterval(interval);
        setChannel(getChannel());
      }
    }, 500);
    /*
     * Clear the timeout on unmount
     */
    return () => clearInterval(interval);
  }, [channelId, chatClient, ethereal, userWalletAddress, username]);

  if (!channel) {
    return <MiniSpinnerLoader loadingText={MSG.loading} />;
  }

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
