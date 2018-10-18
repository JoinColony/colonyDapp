/* @flow */

const mockInbox = [
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
    colonyName: 'Cool Clny',
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
    colonyName: 'Cool Clny',
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
    colonyName: 'Cool Clny',
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
    colonyName: 'Cool Clny',
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
    colonyName: 'Other Colony',
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
    colonyName: 'YetAnotherClny',
    taskName: 'Import Task',
  },
];

export default mockInbox;
