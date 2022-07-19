import {
  ActionsPageFeedType,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';

export const colonyAction = {
  actionInitiator: '0x45B17FF6998D4d76A10a32621A71773E3722DA65',
  actionType: 'SystemMessage',
  amount: '0',
  annotationHash: '',
  blockNumber: 827,
  colonyAvatarHash: '',
  colonyDisplayName: 'Colony',
  colonyTokens: [],
  createdAt: 1655807560000,
  domainColor: '',
  domainName: '',
  domainPurpose: '',
  events: [],
  fromDomain: 1,
  hash: '0xb17e40704dc4fd2b95710468516aac1ebca441b276f4fd3db80e5dca065f1089',
  motionDomain: 1,
  motionState: '',
  newVersion: '0',
  oldVersion: '0',
  recipient: '0x0000000000000000000000000000000000000000',
  reputationChange: '0',
  roles: [
    {
      id: 0,
      setTo: false,
    },
  ],
  toDomain: 1,
  status: 1,
  tokenAddress: '0x0000000000000000000000000000000000000000',
};

export const transactionHash =
  '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138';

export const systemMessages = [
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'ExpenditureStaked' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'Chris',
        displayName: 'Christian Maniewski',
      },
    },
    values: {
      amount: '10 CLNY',
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    amount: '10.765 CLNY',
    uniqueId: '1',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'ExpenditureFunding' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'Chris',
        displayName: 'Christian Maniewski',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    funds: ['10.765 CLNY', '0.0500 xDai'],
    uniqueId: '2',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'ExpenditureModified' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'Chris',
        displayName: 'Christian Maniewski',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    amount: '10.765 CLNY',
    changes: [
      {
        changeType: 'recipient',
        prevValue: 'Payment 1',
        recipient: {
          id: '1',
          profile: {
            walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
            username: 'Chris',
            displayName: 'Christian Maniewski',
          },
        },
      },
      {
        changeType: 'value',
        currValue: '1.2345 wETH',
      },
      {
        changeType: 'claimDelay',
        currValue: '24 hours',
      },
    ],
    uniqueId: '3',
  },
];
