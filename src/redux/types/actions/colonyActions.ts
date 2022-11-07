import { RefObject } from 'react';
import { BigNumber } from 'ethers/utils';
import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';
import { Color } from '~core/ColorTag';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

/*
 * @NOTE About naming
 * I couldn't come up with anything better, as we already have ColonyActionTypes :(
 */
export type ColonyActionsActionTypes =
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_CREATE,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainName: string;
        domainColor?: Color;
        domainPurpose?: string;
        annotationMessage?: string;
        parentId?: number;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_CREATE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_EDIT,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainName: string;
        domainColor?: Color;
        domainPurpose?: string;
        annotationMessage?: string;
        domainId: number;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT,
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
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EDIT_COLONY,
      {
        colonyAddress: Address;
        colonyName: string;
        colonyDisplayName: string;
        colonyAvatarImage?: string;
        colonyAvatarHash?: string;
        hasAvatarChanged?: boolean;
        colonyTokens?: Address[];
        verifiedAddresses?: Address[];
        annotationMessage?: string;
        isWhitelistActivated?: boolean;
        /*
         * @TODO I think this will also store the subscribed-to tokens list
         */
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        colonyName?: string;
        tokenAddress: Address;
        fromDomainId: number;
        toDomainId: number;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MINT_TOKENS,
      {
        colonyAddress: Address;
        colonyName?: string;
        nativeTokenAddress: Address;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MINT_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_VERSION_UPGRADE,
      {
        colonyAddress: Address;
        version: string;
        colonyName?: string;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_VERSION_UPGRADE_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_UNLOCK_TOKEN,
      {
        colonyAddress: Address;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY,
      {
        colonyAddress: Address;
        walletAddress: Address;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_SET_SLOT,
      {
        colonyAddress: Address;
        walletAddress: Address;
        startBlock: number;
        storageSlotLocation: string;
        storageSlotValue: string;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_SET_SLOT_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.ACTION_RECOVERY_SET_SLOT_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_APPROVE,
      {
        colonyAddress: Address;
        walletAddress: Address;
        startBlock: number;
        scrollToRef: RefObject<HTMLInputElement>;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_APPROVE_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.ACTION_RECOVERY_APPROVE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_EXIT,
      {
        colonyAddress: Address;
        startBlock: number;
        scrollToRef: RefObject<HTMLInputElement>;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_EXIT_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.ACTION_RECOVERY_EXIT_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_REPUTATION,
      {
        colonyAddress: Address;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        isSmitingReputation?: boolean;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_ADD_EXISTING_SAFE,
      {
        colonyName: string;
        colonyAddress: Address;
        chainId: number;
        safeName: string;
        contractAddress: string;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_ADD_EXISTING_SAFE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_ADD_EXISTING_SAFE_SUCCESS,
      MetaWithHistory<object>
    >;
