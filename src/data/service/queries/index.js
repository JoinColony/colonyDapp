// /* @flow */
//
// import type { EventStore } from '../../../lib/database/stores';
// import type { DDB } from '../../../lib/database';
//
// import { getColonyStore } from '../../stores';
// import { COLONY_EVENT_TYPES } from '../../constants';
// // import { QuerySpec } from './types';
//
// const ALLOWED_EVENT_TYPES = Object.keys(COLONY_EVENT_TYPES);
//
// // eslint-disable-next-line import/prefer-default-export
// export const getColony = (colonyClientddb: DDB) => async (
//   walletAddress: string,
//   colonyENSName: string,
// ) => {
//   // @TODO: We need to sort out flow typing for DDB
//   const colonyStore: EventStore = (await getColonyStore(ddb)(
//     walletAddress,
//     colonyENSName,
//   ): any);
//   const log = await colonyStore.all();
//   return log
//     .filter(({ type: eventType }) => ALLOWED_EVENT_TYPES.includes(eventType))
//     .reduce(
//       (colony, event) => ({
//         ...colony,
//         ...event.payload,
//       }),
//       {},
//     );
// };
