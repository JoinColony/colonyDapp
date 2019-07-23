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
  nativeToken: TokenReferenceType,
  permissions: UserPermissionsType,
};

const TabContribute = ({
  colony,
  filteredDomainId,
  filterOption,
  nativeToken,
  permissions,
}: Props) => {
  /*
   * Small helpers to make the funding display logic easier to read
   */
  const isBalanceZero =
    nativeToken && nativeToken.balance && nativeToken.balance.isZero();
  const isFounderOrAdmin = canAdminister(permissions) && isFounder(permissions);

  /*
   * If it's a native token, balance is 0 and the user can mint it. If it's an external token, balance is zero, and the user is and Admin or Founder
   */
  const showFundingPanel =
    nativeToken &&
    isBalanceZero &&
    ((!nativeToken.isExternal && colony.canMintNativeToken) ||
      (nativeToken.isExternal && isFounderOrAdmin));

  return (
    <>
      {showFundingPanel && (
        <ColonyInitialFunding
          colonyAddress={colony.colonyAddress}
          displayName={colony.displayName}
          tokenAddress={nativeToken.address}
          isExternal={nativeToken.isExternal}
        />
      )}
      <ColonyTasks
        canCreateTask={canCreateTask(permissions)}
        colonyAddress={colony.colonyAddress}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        isInRecoveryMode={isInRecoveryMode(colony)}
      />
    </>
  );
};

export default TabContribute;
