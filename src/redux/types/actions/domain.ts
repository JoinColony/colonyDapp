import { Address } from '~types/index';
import { DomainType } from '~immutable/index';
import { ActionType, ErrorActionType, UniqueActionType } from './index';
import { ActionTypes } from '../../index';

export type DomainActionTypes =
  | UniqueActionType<
      ActionTypes.DOMAIN_CREATE,
      { colonyAddress: Address; domainName: string; parentDomainId?: number },
      object
    >
  | ErrorActionType<ActionTypes.DOMAIN_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.DOMAIN_CREATE_SUCCESS,
      { colonyAddress: string; domain: DomainType },
      object
    >
  | ActionType<ActionTypes.DOMAIN_CREATE_TX>
  | ErrorActionType<ActionTypes.DOMAIN_CREATE_TX_ERROR, object>
  | ActionType<ActionTypes.DOMAIN_CREATE_TX_SUCCESS>
  | UniqueActionType<
      ActionTypes.DOMAIN_EDIT,
      {
        colonyAddress: Address;
        domainName: string;
        parentDomainId?: number;
        domainId: number;
      },
      null
    >
  | ErrorActionType<ActionTypes.DOMAIN_EDIT_ERROR, null>
  | UniqueActionType<
      ActionTypes.DOMAIN_EDIT_SUCCESS,
      {
        colonyAddress: string;
        domainId: number;
        domainName: string;
        parentId?: number;
      },
      null
    >;
