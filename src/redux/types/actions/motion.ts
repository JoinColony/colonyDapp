import { BigNumber } from 'ethers/utils';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

export type MotionActionTypes =
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_STAKE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        amount: BigNumber;
        transactionHash: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_STAKE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_STAKE_SUCCESS,
      MetaWithHistory<object>
    >;
