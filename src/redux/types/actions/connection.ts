import { ActionType, ActionTypeWithPayload, ErrorActionType } from './index';

import { ActionTypes } from '../../index';

export type ConnectionActionTypes =
  | ErrorActionType<ActionTypes.CONNECTION_STATS_SUB_ERROR, { scope: string }>
  | ActionTypeWithPayload<
      ActionTypes.CONNECTION_STATS_SUB_EVENT,
      {
        busyStores: string[];
        openStores: number;
        ping: number;
        pinners: string[];
        pinnerBusy: boolean;
        pubsubPeers: string[];
        swarmPeers: string[];
      }
    >
  | ActionType<ActionTypes.CONNECTION_STATS_SUB_START>
  | ActionType<ActionTypes.CONNECTION_STATS_SUB_STOP>;
