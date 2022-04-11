import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { PubNubProvider } from 'pubnub-react';
import { Chat, MessageList } from '@pubnub/react-chat-components';

import { MiniSpinnerLoader } from '~core/Preloaders';

import { ContextModule, TEMP_getContext } from '~context/index';
import { useLoggedInUser, useUser } from '~data/index';

import PubNubSingleMessage from './PubNubSingleMessage';
import PubNubCommentInput from './PubNubCommentInput';

import styles from './UserProfilePubNumComments.css';

interface Props {
  channelId: string;
}

const MSG = defineMessages({
  loading: {
    id: 'users.UserProfilePubNumComments.loading',
    defaultMessage: 'Loading messages',
  },
});

const displayName = 'users.UserProfilePubNumComments';

const UserProfilePubNumComments = ({ channelId }: Props) => {
  const {
    ethereal,
    walletAddress: userWalletAddress,
    username,
  } = useLoggedInUser();

  const chatClient = TEMP_getContext(ContextModule.PubNubChatClient);
  const [commentUser, setCommentUser] = useState(false);

  const user = useUser(userWalletAddress);

  const STREAM_CHANNEL_TYPE = 'user';
  const channelName = `${STREAM_CHANNEL_TYPE}.${channelId}`;

  useEffect(() => {
    const pubNubSetup = async (client) => {
      const friendlyName =
        user?.profile?.displayName ||
        user?.profile?.username ||
        userWalletAddress;
      await client.setUUID(ethereal ? 'ethereal' : userWalletAddress);
      if (!ethereal) {
        await client.objects.setUUIDMetadata({
          data: {
            name: friendlyName,
            custom: {
              displayName: friendlyName,
              username: user?.profile?.username,
              walletAddress: userWalletAddress,
            },
          },
        });
      }
      setCommentUser(true);
    };

    if (chatClient) {
      pubNubSetup(chatClient);
    }
  }, [
    channelId,
    channelName,
    chatClient,
    commentUser,
    ethereal,
    user,
    userWalletAddress,
  ]);

  if (!commentUser) {
    return <MiniSpinnerLoader loadingText={MSG.loading} />;
  }

  return (
    <div className={styles.main}>
      <PubNubProvider client={chatClient}>
        <Chat {...{ currentChannel: channelName }}>
          <MessageList
            fetchMessages={99999999999999999999}
            messageRenderer={({ message }) => (
              // @ts-ignore
              <PubNubSingleMessage {...message} />
            )}
          />
          <div className={styles.controls}>
            <PubNubCommentInput
              client={chatClient}
              channel={channelName}
              disabled={ethereal || !username}
            />
          </div>
        </Chat>
      </PubNubProvider>
    </div>
  );
};

UserProfilePubNumComments.displayName = displayName;

export default UserProfilePubNumComments;
