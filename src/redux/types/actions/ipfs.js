/* @flow */

import type { WithKey } from '~types';
import type {
  ActionType,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type IpfsActionTypes = {|
  IPFS_DATA_UPLOAD: UniqueActionType<
    typeof ACTIONS.IPFS_DATA_UPLOAD,
    {|
      ipfsData: string,
    |},
    void,
  >,
  IPFS_DATA_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.IPFS_DATA_FETCH_ERROR,
    void,
  >,
  IPFS_DATA_UPLOAD_SUCCESS: UniqueActionType<
    typeof ACTIONS.IPFS_DATA_FETCH_SUCCESS,
    {|
      ipfsHash: string,
      ipfsData: string,
    |},
    void,
  >,
  IPFS_DATA_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.IPFS_DATA_FETCH,
    {|
      ipfsHash: string,
    |},
    WithKey,
  >,
  IPFS_DATA_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.IPFS_DATA_FETCH_ERROR,
    WithKey,
  >,
  IPFS_DATA_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.IPFS_DATA_FETCH_SUCCESS,
    {|
      ipfsHash: string,
      ipfsData: string,
    |},
    WithKey,
  >,
  IPFS_STATS_SUB_ERROR: ErrorActionType<typeof ACTIONS.IPFS_STATS_SUB_ERROR>,
  IPFS_STATS_SUB_EVENT: ActionTypeWithPayload<
    typeof ACTIONS.IPFS_STATS_SUB_EVENT,
    {|
      ping: number,
      pinners: string[],
      pinnerBusy: string[],
      pubsubPeers: string[],
      swarmPeers: string[],
    |},
  >,
  IPFS_STATS_SUB_START: ActionType<typeof ACTIONS.IPFS_STATS_SUB_START>,
  IPFS_STATS_SUB_STOP: ActionType<typeof ACTIONS.IPFS_STATS_SUB_STOP>,
|};
