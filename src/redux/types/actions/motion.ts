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
      ActionTypes.MOTION_STAKE,
      {
        colonyAddress: Address;
        motionId: string;
        vote: number;
        amount: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_STAKE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_STAKE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_OBJECT,
      {
        colonyAddress: Address;
        motionId: string;
        vote: number;
        amount: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.MOTION_OBJECT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_OBJECT_SUCCESS,
      MetaWithHistory<object>
    >;
