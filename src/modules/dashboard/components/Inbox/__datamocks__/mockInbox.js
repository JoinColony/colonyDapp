/* @flow */

const mockInbox = [
  {
    id: 1,
    action: 'assigned you a task:',
    task: 'Develop Github integration',
    domain: '#Development',
    colonyName: 'Zirtual',
    createdAt:
      'Fri Sep 28 2018 15:43:13 GMT+0200 (Central European Summer Time)',
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
    createdAt:
      'Fri Sep 27 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
  },
  {
    id: 3,
    action: 'lets you know that it is ready:',
    task: 'Design Landing Page',
    domain: '#Design',
    colonyName: 'GitCoin',
    createdAt:
      'Fri Sep 25 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdwad',
      username: 'Cornelia Bodenbaum',
    },
  },
  {
    id: 4,
    action: 'has a question about:',
    task: 'Provide user research',
    domain: '#UX',
    colonyName: 'UPort',
    createdAt:
      'Fri Sep 24 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Stefan Zweig',
    },
  },
  {
    id: 5,
    action: 'asks to confirm assignment:',
    task: 'Write financial report',
    domain: '#Finance',
    colonyName: 'UPort',
    createdAt:
      'Fri Sep 23 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Carlos Martinez',
    },
  },
  {
    id: 6,
    action: 'commented on:',
    task: 'Prepare presentation',
    domain: '#Social Science',
    colonyName: 'OECD',
    createdAt:
      'Fri Sep 22 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Ludwig Kartoffelstampfer',
    },
  },
  {
    id: 7,
    action: 'commented on:',
    task: 'Provide Feedback to students',
    domain: '#Math',
    colonyName: 'Cornelsen',
    createdAt:
      'Fri Sep 21 2018 15:43:13 GMT+0200 (Central European Summer Time)',
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Axel Mäusezahn',
    },
  },
];

export default mockInbox;
