/* @flow */

const mockInbox = [
  {
    id: 0,
    event: 'notificationUserClaimedProfile',
    createdAt: new Date(2018, 10, 1),
    unread: true,
    user: {
      walletAddress: '0xF822d689a2e10c1511dcD54dF5Ce43a9d393e75c',
      username: 'Ragny',
    },
    colonyLabel: 'The Nords',
  },
  {
    id: 1,
    event: 'actionColonyFundingReceived',
    createdAt: new Date(2018, 8, 19),
    unread: true,
    user: {
      walletAddress: '0xdeadbeef',
      username: 'John Smith',
    },
    amount: {
      unit: '$',
      value: 10.3,
    },
    colonyLabel: 'Cool Clny',
    onClickRoute: '/colony/1',
  },
  {
    id: 2,
    event: 'notificationAdminOtherAdded',
    createdAt: new Date(2018, 9, 17),
    unread: true,
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    colonyLabel: 'Cool Clny',
    otherUser: 'Another Person',
  },
  {
    id: 3,
    event: 'notificationAdminOtherAdded',
    createdAt: new Date(2018, 9, 15),
    unread: true,
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    colonyLabel: 'Cool Clny',
    otherUser: 'Another Person',
  },
  {
    id: 4,
    event: 'notificationAdminOtherAdded',
    createdAt: new Date(2018, 9, 16),
    unread: true,
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    colonyLabel: 'Cool Clny',
    otherUser: 'Another Person',
  },
  {
    id: 5,
    event: 'actionWorkerRatingPeriodBegun',
    createdAt: new Date(2018, 9, 16),
    unread: false,
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    colonyLabel: 'Other Colony',
    domainName: '#Skillz',
    taskName: 'Import Task',
  },
  {
    id: 6,
    event: 'actionWorkerTaskFinalized',
    createdAt: new Date(2018, 9, 16),
    unread: true,
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
    colonyLabel: 'YetAnotherClny',
    taskName: 'Import Task',
  },
];

export default mockInbox;
