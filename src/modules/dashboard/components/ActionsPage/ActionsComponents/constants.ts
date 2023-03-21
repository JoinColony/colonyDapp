// Mock data. Replace with backend data (DAO Incorporation Motion details) when ready.
export const cost = 5300;
export const source = 1;
export const incorporationName = 'WallStreetBets';

export const mockColonyActionData = {
  colonyAction: {
    actionInitiator: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    actionType: 'DAOIncorporationMotion',
    amount: '5300',
    annotationHash: null,
    blockNumber: 922,
    colonyAvatarHash: '#123',
    colonyDisplayName: 'test',
    colonyTokens: [],
    createdAt: 1678185528000,
    domainColor: '',
    domainName: '1',
    domainPurpose: '',
    events: [
      {
        createdAt: 1678185528000,
        emmitedBy: 'VotingReputationClient',
        name: 'MotionCreated',
        transactionHash:
          '0xe459e77c2b10e8b391c71fe0c3a788e176301221d5b201dcdfa582d7754a80ac',
        type: 'NetworkEvent',
        values: '',
      },
    ],
    fromDomain: 1,
    hash: '0xe459e77c2b10e8b391c71fe0c3a788e176301221d5b201dcdfa582d7754a80ac',
    motionDomain: 1,
    motionState: 'Staking',
    newVersion: '0',
    oldVersion: '0',
    recipient: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    reputationChange: '0',
    roles: [],
    rootHash:
      '0x113f47cccf1266a78e892a719efb64e82892999ed9a6c042af53e63827f6d42c',
    status: 1,
    toDomain: 1,
    tokenAddress: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    cost: 5300,
    source: 1,
    incorporationName: 'WallStreetBets',
  },
};

export const initiatorProfileWithFallbackMock = {
  id: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  profile: {
    avatarHash: null,
    bio: null,
    displayName: null,
    location: null,
    username: 'john doe',
    walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    website: null,
  },
};

export const recipientProfileWithFallbackMock = {
  id: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  profile: {
    avatarHash: null,
    bio: null,
    displayName: null,
    location: null,
    username: 'john doe',
    walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    website: null,
  },
};

export const tokenDataMock = {
  address: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
  decimals: 18,
  iconHash: null,
  name: 'xDai',
  symbol: 'XDAI',
};
