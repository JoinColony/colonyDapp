/* @flow */

const usersMocks: Array<Object> = [
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
  {
    id: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
    username: 'Chris',
    fullName: 'Christian Maniewski',
  },
  {
    id: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
    username: 'Elena',
    fullName: 'Elena Dimitrova',
  },
  {
    id: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
    username: 'Thiago',
    fullName: 'Thiago Delgado',
  },
  {
    id: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
    username: 'Alex',
    fullName: 'Alex Rea',
  },
  {
    id: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    username: 'Collin',
    fullName: 'Collin Vine',
  },
];

export default usersMocks;
