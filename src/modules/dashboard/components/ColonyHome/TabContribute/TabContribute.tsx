import React from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { ColonyType, ColonyTokenReferenceType } from '~immutable/index';
import { isInRecoveryMode } from '../../../checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

interface Props {
  allowTaskCreation: boolean;
  colony: ColonyType;
  filteredDomainId: number;
  filterOption: string;
  ethTokenRef: ColonyTokenReferenceType | null;
  nativeTokenRef: ColonyTokenReferenceType | null;
  showQrCode: boolean;
}

const TabContribute = ({
  allowTaskCreation,
  colony,
  filteredDomainId,
  filterOption,
  ethTokenRef,
  nativeTokenRef,
  showQrCode,
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
        canCreateTask={allowTaskCreation}
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
