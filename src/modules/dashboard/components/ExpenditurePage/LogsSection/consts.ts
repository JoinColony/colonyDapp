export const logs = [
  {
    type: 'action',
    actionType: 'Staked',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'Chris',
        displayName: 'Christian Maniewski',
      },
    },
    values: {
      amount: '10',
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    amount: '10.765 CLNY',
    uniqueId: '1',
  },
  {
    type: 'action',
    actionType: 'ChangingTheExpenditure',
    user: {
      id: '1',
      profile: {
        walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
        username: 'Chris',
        displayName: 'Christian Maniewski',
      },
    },
    values: {
      amount: '10',
    },
    createdAt: 1653900557000,
    blockExplorerName: 'Blockscout',
    transactionHash:
      '0x1785d214f0127279681354be8e23ad1a1501207432229db93a415c7a58427138',
    amount: '10.765 CLNY',
    changes: [
      {
        changeType: 'Recipient',
        prevValue: 'Recipient 1',
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
        changeType: 'Value',
        currValue: '1.2345 wETH',
      },
      {
        changeType: 'ClaimDelay',
        currValue: '24 hours',
      },
    ],
    uniqueId: '2',
  },
  {
    type: 'comment',
    adminDelete: false,
    colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
    deleted: false,
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    transactionHash:
      '0x358f8bbe6bf277bbe8a9546166bfdd23c58cc5491114df6f749534fcf27b05d1',
    userBanned: false,
    initiator: {
      id: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
      profile: {
        avatarHash: null,
        displayName: null,
        username: 'Anna Doe',
        walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
        __typename: 'UserProfile',
      },
      __typename: 'User',
    },
    initiatorAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    sourceId: '6295b94a85b0d55cd8aaeda5',
    sourceType: 'db',
    uniqueId: '3',
  },
];

export const colony = {
  avatarHash: null,
  avatarURL: null,
  canColonyMintNativeToken: true,
  canColonyUnlockNativeToken: true,
  colonyAddress: '0xA1e73506F3ef6dC19dc27B750ADF585FD0F30C63',
  colonyName: 'test2',
  displayName: 'test2',
  domains: [
    {
      domainId: 1,
      color: 0,
      description: null,
      ethDomainId: 1,
      ethParentDomainId: null,
      id: '0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_domain_1',
      name: 'Root',
    },
  ],
  extensionAddresses: ['0xda571541f04ce3879bef2933792046967f149d52'],
  id: 3,
  isDeploymentFinished: true,
  isInRecoveryMode: false,
  isNativeTokenLocked: true,
  nativeTokenAddress: '0xdeFB1b38a01254D5861EFEee5bC0674242acF12D',
  version: '8',
  roles: [
    {
      address: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
      domains: [
        {
          domainId: 1,
          roles: '1',
        },
      ],
    },
  ],
  tokenAddresses: ['0xdeFB1b38a01254D5861EFEee5bC0674242acF12D'],
  tokens: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      iconHash: '',
      id: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      processedBalances: [
        { __typename: 'DomainBalance', domainId: 1, amount: '0' },
        { __typename: 'DomainBalance', domainId: 0, amount: '0' },
      ],
      symbol: 'ETH',
    },
  ],
};
