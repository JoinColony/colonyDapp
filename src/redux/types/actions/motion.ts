import { ActionTypeWithMeta, ActionTypes } from '~redux/index';

type WithId = { id: string };

export type MotionActionTypes =
  | ActionTypeWithMeta<ActionTypes.MOTION_STAKE, WithId>
  | ActionTypeWithMeta<ActionTypes.MOTION_STAKE_SUCCESS, WithId>
  | ActionTypeWithMeta<ActionTypes.MOTION_STAKE_ERROR, WithId>;
