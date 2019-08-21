/* @flow */

import React from 'react';

import type {
  ColonyType,
  TokenReferenceType,
  UserPermissionsType,
} from '~immutable';

import { isInRecoveryMode } from '../../../checks';
import {
  canAdminister,
  canCreateTask,
  isFounder,
} from '../../../../users/checks';

import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

type Props = {
  colony: ColonyType,
  filteredDomainId: number,
  filterOption: string,
  nativeTokenRef: ?TokenReferenceType,
  ethTokenRef: ?TokenReferenceType,
  permissions: UserPermissionsType,
};

const TabContribute = ({
  colony,
  filteredDomainId,
  filterOption,
  ethTokenRef,
  nativeTokenRef,
  permissions,
}: Props) => {
  const isColonyTokenBalanceZero =
    nativeTokenRef && nativeTokenRef.balance && nativeTokenRef.balance.isZero();
  const isEthBalanceZero =
    ethTokenRef && ethTokenRef.balance && ethTokenRef.balance.isZero();

  const canMintTokens = !!(
    nativeTokenRef &&
    !nativeTokenRef.isExternal &&
    colony.canMintNativeToken
  );
  const showQrCode = !!(
    nativeTokenRef &&
    canAdminister(permissions) &&
    isFounder(permissions)
  );

  return (
    <>
      {nativeTokenRef && isColonyTokenBalanceZero && isEthBalanceZero && (
        /*
         * The funding panel should be shown if the colony's balance of
         * both the native token and ETH is zero.
         */
        <ColonyInitialFunding
          canMintTokens={canMintTokens}
          colonyAddress={colony.colonyAddress}
          displayName={colony.displayName}
          isExternal={nativeTokenRef.isExternal}
          showQrCode={showQrCode}
          tokenAddress={nativeTokenRef.address}
        />
      )}
      <ColonyTasks
        canCreateTask={canCreateTask(permissions)}
        colonyAddress={colony.colonyAddress}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        isInRecoveryMode={isInRecoveryMode(colony)}
        canMintTokens={canMintTokens}
        showEmptyState={
          /*
           * @NOTE I couldn't assign this to a variable and re-use it because
           * of Flow not properly inferring values
           */
          !(nativeTokenRef && isColonyTokenBalanceZero && isEthBalanceZero)
        }
      />
    </>
  );
};

export default TabContribute;
