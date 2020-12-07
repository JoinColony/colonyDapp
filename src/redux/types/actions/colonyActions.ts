import { BigNumber } from 'ethers/utils';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

import { ErrorActionType, UniqueActionType } from './index';

/*
 * @NOTE About naming
 * I couldn't come up with anything better, as we already have ColonyActionTypes :(
 */
export type ColonyActionsActionTypes =
  | UniqueActionType<
      ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT,
      {
        colonyAddress: Address;
        recipientAddress: Address;
        amount: BigNumber;
      },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      object,
      object
    >;
