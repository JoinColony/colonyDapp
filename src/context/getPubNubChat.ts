import PubNub from 'pubnub';

const getPubNubChatClient = () => {
  const STORAGE_KEY = 'dsettings';
  const decentralizedStorage = JSON.parse(
    localStorage.getItem(STORAGE_KEY) as string,
  );

  const commentsEnabled =
    typeof decentralizedStorage?.commentsEnabled === 'boolean'
      ? decentralizedStorage?.commentsEnabled
      : true;

  if (
    process.env.PN_PUB_KEY &&
    process.env.PN_SUB_KEY &&
    commentsEnabled &&
    !decentralizedStorage?.enabled
  ) {
    const client = new PubNub({
      publishKey: process.env.PN_PUB_KEY,
      subscribeKey: process.env.PN_SUB_KEY,
      uuid: 'ethereal',
    });
    return client;
  }
  return undefined;
};

export default getPubNubChatClient;
