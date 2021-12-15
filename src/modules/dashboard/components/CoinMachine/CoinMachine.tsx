import React, { useEffect, useMemo } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension, Network } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { DEFAULT_NETWORK } from '~constants';
import ExternalLink from '~core/ExternalLink';
import { SpinnerLoader } from '~core/Preloaders';
import BreadCrumb, { Crumb } from '~core/BreadCrumb';

import {
  useColonyExtensionsQuery,
  useCoinMachineSaleTokensQuery,
  useCurrentPeriodTokensQuery,
  Colony,
  useCoinMachineCurrentSalePeriodQuery,
  useCoinMachineTokenBalanceQuery,
  useCoinMachineCurrentPeriodPriceQuery,
  useCoinMachineCurrentPeriodMaxUserPurchaseQuery,
  useCoinMachineTotalTokensQuery,
  useLoggedInUser,
  useMetaColonyQuery,
} from '~data/index';

import { CM_LEARN_MORE, CM_GET_WHITELISTED } from '~externalUrls';

import Chat from './Chat';
import SaleStateWidget from './SaleStateWidget';
import BuyTokens from './BuyTokens';
import Confetti from './Confetti';
import TokenSalesTable from './TokenSalesTable';
import { RemainingTime, RemainingTokens } from './RemainingDisplayWidgets';

import styles from './CoinMachine.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.CoinMachine.loading',
    defaultMessage: `Loading Buy Tokens`,
  },
  title: {
    id: 'dashboard.CoinMachine.title',
    defaultMessage: `Tokens`,
  },
  buyTokens: {
    id: 'dashboard.CoinMachine.buyTokens',
    defaultMessage: 'Buy {symbol}',
  },
  getWhitelisted: {
    id: 'dashboard.CoinMachine.getWhitelisted',
    defaultMessage: 'How to get whitelisted',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine';

const DISABLE_CHAT = false;
const SHARE_ENABLED = true;

const CoinMachine = ({
  colony: { colonyAddress, colonyName },
  colony,
}: Props) => {
  const { transactionHash } = useParams<{
    transactionHash: string;
  }>();
  const { walletAddress } = useLoggedInUser();
  const { data: metaColonyData } = useMetaColonyQuery();

  const {
    data: extensionsData,
    loading: loadingExtensionsData,
  } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const pollInterval = DEFAULT_NETWORK === Network.Mainnet ? 20000 : 5000;
  const { installedExtensions = [] } = extensionsData?.processedColony || {};
  const coinMachineExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.CoinMachine,
  );

  const {
    data: saleTokensData,
    loading: saleTokensLoading,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const {
    data: currentSalePeriodData,
    loading: currentSalePeriodLoading,
    stopPolling: stopcurrentSalePeriodPolling,
  } = useCoinMachineCurrentSalePeriodQuery({
    variables: { colonyAddress },
    /*
     * Refetch every minute to try and keep the timers in sync with the chain
     */
    pollInterval: 60 * 1000,
    fetchPolicy: 'network-only',
  });

  const {
    data: periodTokensData,
    stopPolling: stopPollingCurrentPeriodTokensData,
    loading: periodTokensLoading,
  } = useCurrentPeriodTokensQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
    pollInterval,
  });

  const {
    data: coinMachineTokenBalanceData,
    loading: coinMachineTokenBalanceLoading,
  } = useCoinMachineTokenBalanceQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: totalTokensData,
    loading: totalTokensDataLoading,
    stopPolling: stopPollingTotalTokensData,
  } = useCoinMachineTotalTokensQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
    pollInterval,
  });

  const {
    data: salePriceData,
    loading: loadingSalePrice,
    stopPolling: stopPollingCurrentPeriodPrice,
  } = useCoinMachineCurrentPeriodPriceQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
    pollInterval,
  });

  const {
    data: maxUserPurchaseData,
    loading: loadingMaxUserPurchase,
    stopPolling: stopPollingCurrentPeriodMaxUserPurchase,
  } = useCoinMachineCurrentPeriodMaxUserPurchaseQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    fetchPolicy: 'network-only',
    pollInterval,
  });

  const hasSaleStarted = !bigNumberify(
    coinMachineTokenBalanceData?.coinMachineTokenBalance || 0,
  ).isZero();

  const {
    activeSoldTokens: activeSold = '0',
    maxPerPeriodTokens: maxPerPeriod = '0',
    targetPerPeriodTokens: targetPerPeriod = '0',
  } = periodTokensData?.currentPeriodTokens || {};

  const periodTokens = useMemo(() => {
    if (!saleTokensData || !periodTokensData || !hasSaleStarted) {
      return undefined;
    }
    const maxPerPeriodTokens = bigNumberify(maxPerPeriod);
    const leftAvailableTokens = bigNumberify(
      coinMachineTokenBalanceData?.coinMachineTokenBalance || '0',
    );

    return {
      decimals: saleTokensData.coinMachineSaleTokens.sellableToken.decimals,
      soldPeriodTokens: bigNumberify(activeSold),
      maxPeriodTokens: maxPerPeriodTokens.gt(leftAvailableTokens)
        ? leftAvailableTokens
        : bigNumberify(maxPerPeriod),
      targetPeriodTokens: bigNumberify(targetPerPeriod),
    };
  }, [
    saleTokensData,
    periodTokensData,
    hasSaleStarted,
    activeSold,
    maxPerPeriod,
    targetPerPeriod,
    coinMachineTokenBalanceData,
  ]);

  const totalTokens = useMemo(() => {
    if (!saleTokensData || !totalTokensData || !hasSaleStarted) {
      return undefined;
    }
    return {
      decimals: saleTokensData.coinMachineSaleTokens.sellableToken.decimals,
      soldPeriodTokens: bigNumberify(
        totalTokensData.coinMachineTotalTokens.totalSoldTokens,
      ),
      maxPeriodTokens: bigNumberify(
        totalTokensData.coinMachineTotalTokens.totalAvailableTokens,
      ),
    };
  }, [totalTokensData, saleTokensData, hasSaleStarted]);

  const isSoldOut = useMemo(
    () =>
      periodTokens !== undefined &&
      periodTokens.soldPeriodTokens.gte(periodTokens.maxPeriodTokens),
    [periodTokens],
  );

  const { timeRemaining = 0, periodLength = 0 } =
    currentSalePeriodData?.coinMachineCurrentSalePeriod || {};

  useEffect(
    () => () => {
      stopPollingCurrentPeriodPrice();
      stopPollingCurrentPeriodTokensData();
      stopPollingCurrentPeriodMaxUserPurchase();
      stopPollingTotalTokensData();
    },
    [
      stopPollingCurrentPeriodTokensData,
      stopPollingCurrentPeriodPrice,
      stopPollingCurrentPeriodMaxUserPurchase,
      stopPollingTotalTokensData,
    ],
  );

  /*
   * Cleanup on component unmount
   */
  useEffect(
    () => () => {
      stopcurrentSalePeriodPolling();
    },
    [stopcurrentSalePeriodPolling],
  );

  if (
    loadingExtensionsData ||
    saleTokensLoading ||
    currentSalePeriodLoading ||
    !extensionsData?.processedColony?.installedExtensions ||
    periodTokensLoading ||
    coinMachineTokenBalanceLoading ||
    totalTokensDataLoading
  ) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  /*
   * Only allow access to the Coin Machine page, if the extension is:
   * - installed
   * - enable
   * - not deprecated
   */
  if (
    !coinMachineExtension ||
    !coinMachineExtension?.details?.initialized ||
    coinMachineExtension?.details?.deprecated
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const { sellableToken, purchaseToken } =
    saleTokensData?.coinMachineSaleTokens || {};

  const breadCrumbs: Crumb[] = [
    MSG.title,
    <div>
      <FormattedMessage
        {...MSG.buyTokens}
        values={{ symbol: sellableToken?.symbol }}
      />
      {metaColonyData?.processedMetaColony?.colonyAddress === colonyAddress ? (
        <ExternalLink
          className={styles.learnMore}
          text={MSG.getWhitelisted}
          href={CM_GET_WHITELISTED}
        />
      ) : (
        <ExternalLink
          className={styles.learnMore}
          text={{ id: 'text.learnMore' }}
          href={CM_LEARN_MORE}
        />
      )}
    </div>,
  ];

  return (
    <div className={styles.main}>
      <BreadCrumb elements={breadCrumbs} />
      {!transactionHash && <Confetti colonyAddress={colonyAddress} />}
      <div className={styles.grid}>
        {(transactionHash && (
          <div className={styles.saleStarted}>
            <SaleStateWidget
              colony={colony}
              sellableToken={sellableToken}
              timeLeftToNextSale={timeRemaining}
              transactionHash={transactionHash}
              purchaseToken={
                saleTokensData?.coinMachineSaleTokens?.purchaseToken
              }
              canShare={SHARE_ENABLED}
            />
          </div>
        )) || (
          <>
            <div className={styles.buy}>
              <BuyTokens
                colony={colony}
                isCurrentlyOnSale={hasSaleStarted}
                isSoldOut={isSoldOut}
                salePriceData={salePriceData}
                maxUserPurchaseData={maxUserPurchaseData}
                loadingSalePrice={loadingSalePrice}
                loadingMaxUserPurchase={loadingMaxUserPurchase}
              />
            </div>
            <div className={styles.timeRemaining}>
              <RemainingTime
                appearance={{ theme: !isSoldOut ? 'white' : 'danger' }}
                value={hasSaleStarted ? timeRemaining : null}
                periodLength={periodLength}
                colonyAddress={colonyAddress}
                syncing={currentSalePeriodLoading}
              />
            </div>
            <div className={styles.tokensRemaining}>
              <RemainingTokens
                tokenAmounts={periodTokens}
                isTotalSale={false}
              />
            </div>
            <div className={styles.tokensTotals}>
              <RemainingTokens tokenAmounts={totalTokens} isTotalSale />
            </div>
          </>
        )}
        <div className={styles.sales}>
          <TokenSalesTable
            colonyAddress={colonyAddress}
            extensionAddress={coinMachineExtension?.address}
            periodInfo={{
              periodLengthMS: periodLength,
              periodRemainingMS: timeRemaining,
              targetPerPeriod,
              maxPerPeriod,
            }}
            sellableToken={sellableToken}
            purchaseToken={purchaseToken}
            periodTokens={periodTokens}
          />
        </div>
        <div className={styles.comments}>
          <Chat
            colony={colony}
            transactionHash={coinMachineExtension.address}
            disabled={DISABLE_CHAT}
            limit={100}
          />
        </div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
