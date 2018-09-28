/* @flow */

const mockInbox = [
  {
    id: 1,
    action: 'assigned you a task:',
    task: 'Develop Github integration',
    domain: '#Development',
    colonyName: 'Zirtual',
    user: {
      walletAddress: '0xdeadbeef',
      username: 'Brad Pitt',
    },
  },
  {
    id: 2,
    action: 'asks to confirm assignment:',
    task: 'Write docs for JS library',
    domain: '#Development',
    colonyName: 'UNDP',
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
  },
];

export default mockInbox;
