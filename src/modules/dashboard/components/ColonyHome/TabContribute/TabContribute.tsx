import React from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { FullColonyFragment } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';

import { tokenIsETH } from '../../../../core/checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

interface Props {
  allowTaskCreation: boolean;
  colony: FullColonyFragment;
  filteredDomainId: number;
  filterOption: string;
  showQrCode: boolean;
}

const TabContribute = ({
  allowTaskCreation,
  colony: {
    colonyAddress,
    canMintNativeToken,
    displayName,
    isInRecoveryMode,
    isNativeTokenExternal,
    nativeTokenAddress,
    tokens,
  },
  filteredDomainId,
  filterOption,
  showQrCode,
}: Props) => {
  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );
  const ethToken = tokens.find(token => tokenIsETH(token));

  const nativeTokenBalance = getBalanceFromToken(
    nativeToken,
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const ethBalance = getBalanceFromToken(
    ethToken,
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const canMintTokens = !!(
    nativeToken &&
    !isNativeTokenExternal &&
    canMintNativeToken
  );
  const showEmptyState = !(
    nativeToken &&
    nativeTokenBalance.isZero() &&
    ethBalance.isZero()
  );

  return (
    <>
      {nativeToken && nativeTokenBalance.isZero() && ethBalance.isZero() && (
        /*
         * The funding panel should be shown if the colony's balance of
         * both the native token and ETH is zero.
         */
        <ColonyInitialFunding
          canMintTokens={canMintTokens}
          colonyAddress={colonyAddress}
          displayName={displayName}
          isExternal={isNativeTokenExternal}
          showQrCode={showQrCode}
          tokenAddress={nativeToken.address}
        />
      )}
      <ColonyTasks
        canCreateTask={allowTaskCreation}
        colonyAddress={colonyAddress}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        isInRecoveryMode={isInRecoveryMode}
        canMintTokens={canMintTokens}
        showEmptyState={showEmptyState}
      />
    </>
  );
};

export default TabContribute;
