import { WithKey } from '~types/index';
import {
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from './index';

import { ActionTypes } from '../../index';

export type IpfsActionTypes =
  | UniqueActionType<
      ActionTypes.IPFS_DATA_UPLOAD,
      {
        ipfsData: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.IPFS_DATA_UPLOAD_ERROR, object>
  | UniqueActionType<
      ActionTypes.IPFS_DATA_UPLOAD_SUCCESS,
      {
        ipfsHash: string;
        ipfsData: string;
      },
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.IPFS_DATA_FETCH,
      {
        ipfsHash: string;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.IPFS_DATA_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.IPFS_DATA_FETCH_SUCCESS,
      {
        ipfsHash: string;
        ipfsData: string;
      },
      WithKey
    >;
