import React from 'react';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { FullColonyFragment } from '~data/index';

import { tokenIsETH } from '../../../../core/checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

interface Props {
  allowTaskCreation: boolean;
  colonyAddress: FullColonyFragment['colonyAddress'];
  canMintNativeToken: FullColonyFragment['canMintNativeToken'];
  displayName: FullColonyFragment['displayName'];
  filteredDomainId: number;
  filterOption: string;
  isInRecoveryMode: FullColonyFragment['isInRecoveryMode'];
  tokens: FullColonyFragment['tokens'];
  showQrCode: boolean;
}

const TabContribute = ({
  allowTaskCreation,
  colonyAddress,
  canMintNativeToken,
  displayName,
  filteredDomainId,
  filterOption,
  isInRecoveryMode,
  tokens,
  showQrCode,
}: Props) => {
  const nativeTokenRef = tokens.find(token => token.isNative);
  const ethTokenRef = tokens.find(token => tokenIsETH(token));

  const nativeTokenTotalBalance =
    nativeTokenRef &&
    nativeTokenRef.balances &&
    nativeTokenRef.balances.find(
      balance => balance.domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    );
  const isColonyTokenBalanceZero =
    nativeTokenTotalBalance && nativeTokenTotalBalance.balance === '0';

  const ethTotalBalance =
    ethTokenRef &&
    ethTokenRef.balances &&
    ethTokenRef.balances.find(
      balance => balance.domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    );

  const isEthBalanceZero = ethTotalBalance && ethTotalBalance.balance === '0';

  const canMintTokens = !!(
    nativeTokenRef &&
    !nativeTokenRef.isExternal &&
    canMintNativeToken
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
          colonyAddress={colonyAddress}
          displayName={displayName}
          isExternal={nativeTokenRef.isExternal}
          showQrCode={showQrCode}
          tokenAddress={nativeTokenRef.address}
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
