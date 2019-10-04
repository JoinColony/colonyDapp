import React from 'react';

import { ColonyType, ColonyTokenReferenceType } from '~immutable/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '../../../../admin/constants';
import { ColonyRole } from '~types/index';
import { isInRecoveryMode } from '../../../checks';
import { canAdminister, isFounder } from '../../../../users/checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

interface Props {
  colony: ColonyType;
  filteredDomainId: number;
  filterOption: string;
  nativeTokenRef: ColonyTokenReferenceType | null;
  ethTokenRef: ColonyTokenReferenceType | null;
  roles: Record<ColonyRole, boolean>;
}

const TabContribute = ({
  colony,
  filteredDomainId,
  filterOption,
  ethTokenRef,
  nativeTokenRef,
  roles,
}: Props) => {
  const isColonyTokenBalanceZero =
    nativeTokenRef &&
    nativeTokenRef.balances &&
    nativeTokenRef.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID] &&
    nativeTokenRef.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].isZero();
  const isEthBalanceZero =
    ethTokenRef &&
    ethTokenRef.balances &&
    ethTokenRef.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID] &&
    ethTokenRef.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].isZero();

  const canMintTokens = !!(
    nativeTokenRef &&
    !nativeTokenRef.isExternal &&
    colony.canMintNativeToken
  );
  const showQrCode = !!(
    nativeTokenRef &&
    canAdminister(roles) &&
    isFounder(roles)
  );
  const showEmptyState = !(
    nativeTokenRef &&
    isColonyTokenBalanceZero &&
    isEthBalanceZero
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
        canCreateTask={canAdminister(roles)}
        colonyAddress={colony.colonyAddress}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        isInRecoveryMode={isInRecoveryMode(colony)}
        canMintTokens={canMintTokens}
        showEmptyState={showEmptyState}
      />
    </>
  );
};

export default TabContribute;
