import { StreamChat } from 'stream-chat';

const getChatClient = () => {
  const STORAGE_KEY = 'dsettings';
  const decentralizedStorage = JSON.parse(
    localStorage.getItem(STORAGE_KEY) as string,
  );

  if (process.env.STREAM_API && !decentralizedStorage?.enabled) {
    const client = StreamChat.getInstance(process.env.STREAM_API as string);
    if (!client.user) {
      client.connectAnonymousUser();
    }
    return client;
  }
  return undefined;
};

export default getChatClient;
