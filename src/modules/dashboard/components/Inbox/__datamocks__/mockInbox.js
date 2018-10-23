/* @flow */

const mockInbox = [
  {
    id: 1,
    action: 'addedSkillTag',
    task: 'Develop Github integration',
    domain: '#Development',
    colonyName: 'Zirtual',
    createdAt: new Date(2018, 8, 20),
    user: {
      walletAddress: '0xdeadbeef',
      username: 'Brad Pitt',
    },
    unread: false,
    type: 'notification',
  },
  {
    id: 2,
    action: 'assignedUser',
    task: 'Write docs for JS library',
    domain: '#Development',
    colonyName: 'UNDP',
    createdAt: new Date(2018, 8, 19),
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    unread: true,
    type: 'notification',
  },
  {
    id: 3,
    action: 'commentedOn',
    task: 'Design Landing Page',
    domain: '#Design',
    colonyName: 'GitCoin',
    createdAt: new Date(2018, 8, 18),
    user: {
      walletAddress: '0xbeefdwad',
      username: 'Cornelia Bodenbaum',
    },
    unread: true,
    type: 'action',
  },
  {
    id: 4,
    action: 'addedSkillTag',
    task: 'Provide user research',
    domain: '#UX',
    colonyName: 'UPort',
    createdAt: new Date(2018, 8, 16),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Stefan Zweig',
    },
    unread: false,
    type: 'notification',
  },
  {
    id: 5,
    action: 'commentedOn',
    task: 'Write financial report',
    domain: '#Finance',
    colonyName: 'UPort',
    createdAt: new Date(2018, 8, 15),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Carlos Martinez',
    },
    unread: true,
    type: 'notification',
  },
  {
    id: 6,
    action: 'assignedUser',
    task: 'Prepare presentation',
    domain: '#Social Science',
    colonyName: 'OECD',
    createdAt: new Date(2018, 8, 14),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Ludwig Kartoffelstampfer',
    },
    unread: false,
    type: 'notification',
  },
  {
    id: 7,
    action: 'addedSkillTag',
    task: 'Provide Feedback to students',
    domain: '#Math',
    colonyName: 'Cornelsen',
    createdAt: new Date(2018, 8, 13),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Axel Mäusezahn',
    },
    unread: false,
    type: 'notification',
  },
];

export default mockInbox;
