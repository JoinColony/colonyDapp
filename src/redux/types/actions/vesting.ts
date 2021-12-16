import { ActionTypes } from '~redux/index';
import { ErrorActionType, UniqueActionType } from './index';

export type MetacolonyVestingTypes =
  | UniqueActionType<ActionTypes.META_CLAIM_ALLOCATION, {}, object>
  | ErrorActionType<ActionTypes.META_CLAIM_ALLOCATION_ERROR, object>
  | UniqueActionType<ActionTypes.META_CLAIM_ALLOCATION_SUCCESS, object, object>;
