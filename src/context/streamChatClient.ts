import { StreamChat } from 'stream-chat';

const getStreamChatClient = () => {
  const STORAGE_KEY = 'dsettings';
  const decentralizedStorage = JSON.parse(
    localStorage.getItem(STORAGE_KEY) as string,
  );

  const commentsEnabled =
    typeof decentralizedStorage?.commentsEnabled === 'boolean'
      ? decentralizedStorage?.commentsEnabled
      : true;

  if (
    process.env.STREAM_API &&
    commentsEnabled &&
    !decentralizedStorage?.enabled
  ) {
    const client = StreamChat.getInstance(process.env.STREAM_API as string);
    if (!client.user) {
      client.connectAnonymousUser();
    }
    return client;
  }
  return undefined;
};

export default getStreamChatClient;
