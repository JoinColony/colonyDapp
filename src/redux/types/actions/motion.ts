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
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_VOTE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        transactionHash: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_VOTE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_VOTE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_REVEAL_VOTE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        transactionHash: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_REVEAL_VOTE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_REVEAL_VOTE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_FINALIZE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        transactionHash: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_FINALIZE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_FINALIZE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_CLAIM,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        transactionHash: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_CLAIM_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_CLAIM_SUCCESS,
      MetaWithHistory<object>
    >;
