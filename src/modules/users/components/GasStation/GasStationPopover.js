/* @flow */

import { connect } from 'react-redux';

import GasStationPopover from './GasStationPopover.jsx';

import { groupedTransactions } from '../../../core/selectors';

// const mockTransactions = [
//   [
//     {
//       context: 'network',
//       createdAt: '2019-01-28T15:20:07.073Z',
//       errors: [],
//       id: 'wc22jjw70ip0',
//       lifecycle: {
//         created: 'users/USERNAME_CREATE_TX_CREATED',
//         success: 'users/USERNAME_CREATE_SUCCESS',
//         error: 'users/USERNAME_CREATE_ERROR',
//       },
//       methodName: 'registerUserLabel',
//       options: { gasLimit: 500000 },
//       params: {
//         username: 'chmanie',
//         orbitDBPath:
//           '/orbitdb/QmQjmojPtbDStWWTLihcrY2Vo1a73f1n4DNmJ6sHHkufTE/userProfile.VV1hDFzzUy3y5bXnWJUSH/3045022070d61f98813022b0e463ceecaba1c754936aa9ee3fd7ff91e8be96bb74a668f50221008cec6d526123012660d49d6535fe2f362a3b4f06b9d2320ee0b989662f320d53',
//       },
//       status: 'ready',
//     },
//   ],
//   [
//     {
//       context: 'network',
//       createdAt: '2019-01-28T15:20:07.073Z',
//       errors: [],
//       id: 'wc22jjw70ip10',
//       lifecycle: {
//         created: 'users/USERNAME_CREATE_TX_CREATED',
//         success: 'users/USERNAME_CREATE_SUCCESS',
//         error: 'users/USERNAME_CREATE_ERROR',
//       },
//       methodName: 'registerUserLabel',
//       options: { gasLimit: 500000 },
//       params: {
//         username: 'chmanie',
//         orbitDBPath:
//           '/orbitdb/QmQjmojPtbDStWWTLihcrY2Vo1a73f1n4DNmJ6sHHkufTE/userProfile.VV1hDFzzUy3y5bXnWJUSH/3045022070d61f98813022b0e463ceecaba1c754936aa9ee3fd7ff91e8be96bb74a668f50221008cec6d526123012660d49d6535fe2f362a3b4f06b9d2320ee0b989662f320d53',
//       },
//       status: 'failed',
//     },
//   ],
//   [
//     {
//       context: 'network',
//       createdAt: '2019-01-28T15:20:07.073Z',
//       errors: [],
//       id: 'wc22jjw70ip11',
//       lifecycle: {
//         created: 'users/USERNAME_CREATE_TX_CREATED',
//         success: 'users/USERNAME_CREATE_SUCCESS',
//         error: 'users/USERNAME_CREATE_ERROR',
//       },
//       methodName: 'registerUserLabel',
//       options: { gasLimit: 500000 },
//       params: {
//         username: 'chmanie',
//         orbitDBPath:
//           '/orbitdb/QmQjmojPtbDStWWTLihcrY2Vo1a73f1n4DNmJ6sHHkufTE/userProfile.VV1hDFzzUy3y5bXnWJUSH/3045022070d61f98813022b0e463ceecaba1c754936aa9ee3fd7ff91e8be96bb74a668f50221008cec6d526123012660d49d6535fe2f362a3b4f06b9d2320ee0b989662f320d53',
//       },
//       status: 'succeeded',
//     },
//   ],
//   [
//     {
//       context: 'network',
//       createdAt: '2019-01-28T15:20:07.073Z',
//       errors: [],
//       id: 'wc22jjw70ip12',
//       lifecycle: {
//         created: 'users/USERNAME_CREATE_TX_CREATED',
//         success: 'users/USERNAME_CREATE_SUCCESS',
//         error: 'users/USERNAME_CREATE_ERROR',
//       },
//       methodName: 'registerUserLabel',
//       options: { gasLimit: 500000 },
//       params: {
//         username: 'chmanie',
//         orbitDBPath:
//           '/orbitdb/QmQjmojPtbDStWWTLihcrY2Vo1a73f1n4DNmJ6sHHkufTE/userProfile.VV1hDFzzUy3y5bXnWJUSH/3045022070d61f98813022b0e463ceecaba1c754936aa9ee3fd7ff91e8be96bb74a668f50221008cec6d526123012660d49d6535fe2f362a3b4f06b9d2320ee0b989662f320d53',
//       },
//       status: 'multisig',
//     },
//   ],
//   [
//     {
//       context: 'colony',
//       createdAt: '2019-01-28T15:21:07.073Z',
//       errors: [],
//       group: {
//         key: 'createTask',
//         id: 'randomString',
//         index: 0,
//       },
//       id: 'wc22jjw70ip1',
//       lifecycle: {
//         created: 'users/TASK_CREATE_TX_CREATED',
//         success: 'users/TASK_CREATE_SUCCESS',
//         error: 'users/TASK_CREATE_ERROR',
//       },
//       methodName: 'createTask',
//       params: {
//         domainId: 1,
//         skillId: 2,
//       },
//       status: 'ready',
//     },
//     {
//       context: 'colony',
//       createdAt: '2019-01-28T15:21:07.073Z',
//       errors: [],
//       group: {
//         key: 'createTask',
//         id: 'randomString',
//         index: 0,
//       },
//       id: 'wc22jjw70ip2',
//       lifecycle: {
//         created: 'users/TASK_MOVE_FUNDS_TX_CREATED',
//         success: 'users/TASK_MOVE_FUNDS_SUCCESS',
//         error: 'users/TASK_MOVE_FUNDS_ERROR',
//       },
//       methodName: 'moveFundsBetweenPots',
//       params: {
//         taskId: 1,
//       },
//       status: 'ready',
//     },
//     {
//       context: 'colony',
//       createdAt: '2019-01-28T15:21:07.073Z',
//       errors: [],
//       group: {
//         key: 'createTask',
//         id: 'randomString',
//         index: 0,
//       },
//       id: 'wc22jjw70ip',
//       lifecycle: {
//         created: 'users/TASK_SET_PAYOUT_TX_CREATED',
//         success: 'users/TASK_SET_PAYOUT_SUCCESS',
//         error: 'users/TASK_SET_PAYOUT_ERROR',
//       },
//       methodName: 'setTaskWorkerPayout',
//       params: {
//         worker: 1,
//       },
//       status: 'ready',
//     },
//   ],
// ];

export default connect((state: Object) => ({
  transactionGroups: groupedTransactions(state).toJS(),
  // transactionGroups: mockTransactions,
}))(GasStationPopover);
