import { BigNumber } from 'ethers/utils';
import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { Color } from '~core/ColorTag';

import {
  ErrorActionType,
  UniqueActionType,
  UniqueActionTypeWithoutPayload,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

export enum RootMotionOperationNames {
  MINT_TOKENS = 'mintTokens',
  UPGRADE = 'upgrade',
  UNLOCK_TOKEN = 'unlockToken',
}

export type MotionActionTypes =
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_STAKE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        amount: BigNumber;
        annotationMessage?: string;
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
        motionIds: Array<BigNumber>;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_CLAIM_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_CLAIM_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_DOMAIN_CREATE_EDIT,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainName: string;
        domainColor?: Color;
        domainPurpose?: string;
        annotationMessage?: string;
        parentId?: number;
        domainId?: number;
        isCreateDomain: boolean;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_DOMAIN_CREATE_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT,
      {
        colonyAddress: Address;
        colonyName?: string;
        recipientAddress: Address;
        domainId: number;
        singlePayment: {
          amount: BigNumber;
          tokenAddress: Address;
          decimals: number;
        };
        annotationMessage?: string;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_EDIT_COLONY,
      {
        colonyAddress: Address;
        colonyName: string;
        colonyDisplayName: string;
        colonyAvatarImage?: string;
        colonyAvatarHash?: string;
        hasAvatarChanged?: boolean;
        colonyTokens?: Address[];
        annotationMessage?: string;
        /*
         * @TODO I think this will also store the subscribed-to tokens list
         */
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_EDIT_COLONY_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        colonyName?: string;
        version: string;
        tokenAddress: Address;
        fromDomainId: number;
        toDomainId: number;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_MOVE_FUNDS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_ROOT_MOTION,
      {
        operationName: RootMotionOperationNames;
        colonyAddress: Address;
        colonyName?: string;
        motionParams: [BigNumber] | [string];
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_ROOT_MOTION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_ROOT_MOTION_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        annotationMessage?: string;
        motionDomainId: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_USER_ROLES_SET_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_STATE_UPDATE,
      {
        colonyAddress: Address;
        motionId: BigNumber;
        userAddress: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_STATE_UPDATE_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.COLONY_MOTION_STATE_UPDATE_SUCCESS,
      object
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_ESCALATE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_ESCALATE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_ESCALATE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.COLONY_MOTION_MANAGE_REPUTATION,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        motionDomainId: string;
        annotationMessage?: string;
        isSmitingReputation?: boolean;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COLONY_MOTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COLONY_MOTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithHistory<object>
    >;
