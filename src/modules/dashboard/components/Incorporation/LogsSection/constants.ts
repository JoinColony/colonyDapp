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
    name: 'IncorporationCreated' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
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
    name: 'IncorporationStaked' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    values: {
      amount: '10 CLNY',
    },
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    uniqueId: '2',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationOwnerOrForceEdit' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    changes: [
      {
        changeType: 'protectors',
      },
      {
        changeType: 'description',
      },
      {
        changeType: 'mainContact',
      },
      {
        changeType: 'signOption',
      },
    ],
    uniqueId: '1',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationMotionModified' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    changes: [
      {
        changeType: 'puropse',
      },
      {
        changeType: 'name',
      },
      {
        changeType: 'alternativeName',
      },
    ],
    uniqueId: '3',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationMotionPayment' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    uniqueId: '1',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationFailedMotionPayment' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    uniqueId: '1',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationPassedMotionPayment' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    uniqueId: '1',
  },
  {
    type: 'SystemMessage' as ActionsPageFeedType.SystemMessage,
    name: 'IncorporationCompleted' as SystemMessagesName,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'John',
        displayName: 'John Doe',
      },
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    uniqueId: '1',
  },
];
