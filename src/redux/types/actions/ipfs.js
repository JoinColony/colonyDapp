/* @flow */

import type { WithKey } from '~types';
import type {
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
|};
