/* @flow */

import { List } from 'immutable';

import { UserRecord, UserProfileRecord } from '~immutable';

const usersMocks = List.of(
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    }),
  }),
  UserRecord({
    profile: UserProfileRecord({
      // $FlowFixMe
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    }),
  }),
);

export default usersMocks;
