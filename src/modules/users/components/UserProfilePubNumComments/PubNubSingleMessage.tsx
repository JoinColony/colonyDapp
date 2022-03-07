import React from 'react';
import { useUser } from '@pubnub/react-chat-components';

import Comment from '~core/Comment';

export enum MessageType {
  Text = 'text',
}

export interface Message {
  text: string;
  type: MessageType;
}

interface Props {
  uuid?: string;
  publisher?: string;
  channel: string;
  message: Message;
  timetoken: string;
}

const displayName = 'users.UserProfilePubNumComments.PubNubSingleMessage';

const PubNubSingleMessage = ({
  uuid,
  publisher,
  timetoken,
  message: { text },
}: Props) => {
  const [user] = useUser({ uuid: uuid || publisher });

  return (
    <Comment
      createdAt={new Date(parseInt(timetoken, 10) / 10000)}
      comment={text}
      user={{
        id: uuid || publisher || '',
        profile: {
          username: user?.custom?.username as string,
          walletAddress: uuid || publisher || '',
          displayName: user?.custom?.displayName as string,
        },
      }}
      showControls={false}
    />
  );
};

PubNubSingleMessage.displayName = displayName;

export default PubNubSingleMessage;
