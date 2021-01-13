import { Address } from '~types/index';
import { ErrorActionType, UniqueActionType } from './index';
import { ActionTypes } from '../../index';

export type DomainActionTypes =
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
