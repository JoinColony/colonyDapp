import React, { useEffect, useMemo, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { AddressZero } from 'ethers/constants';
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
  useSubgraphTokenBoughtEventsSubscription,
  useCoinMachineCurrentPeriodPriceQuery,
  useCoinMachineCurrentPeriodMaxUserPurchaseQuery,
  useLoggedInUser,
} from '~data/index';

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
  learnMore: {
    id: 'dashboard.CoinMachine.learnMore',
    defaultMessage: 'Learn More',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine';

const LEARN_MORE_LINK =
  'https://colony.gitbook.io/colony/extensions/coin-machine';

/*
 * @TEMP This is temporary while we get ready for the token sale
 */
const DISABLE_CHAT_UTIL_SALE = false;

const CoinMachine = ({
  colony: { colonyAddress, colonyName },
  colony,
}: Props) => {
  const { transactionHash } = useParams<{
    transactionHash: string;
  }>();
  const [tokenBoughtEventsCounter, setTokenBoughtEventsCounter] = useState(0);

  const { walletAddress } = useLoggedInUser();

  const {
    data: extensionsData,
    loading: loadingExtensionsData,
  } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const { installedExtensions = [] } = extensionsData?.processedColony || {};
  const coinMachineExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.CoinMachine,
  );

  const {
    data: tokenBoughtEventsData,
    loading: loadingTokenBoughtEventsData,
  } = useSubgraphTokenBoughtEventsSubscription({
    variables: {
      colonyAddress,
      extensionAddress:
        coinMachineExtension?.address.toLowerCase() || AddressZero,
    },
  });

  const {
    data: saleTokensData,
    loading: saleTokensLoading,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const {
    data: currentSalePeriodData,
    loading: currentSalePeriodLoading,
  } = useCoinMachineCurrentSalePeriodQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: periodTokensData,
    refetch: refetchCurrentPeriodTokensData,
    startPolling: startPollingCurrentPeriodTokensData,
    stopPolling: stopPollingCurrentPeriodTokensData,
    loading: periodTokensLoading,
  } = useCurrentPeriodTokensQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: coinMachineTokenBalanceData,
    loading: coinMachineTokenBalanceLoading,
  } = useCoinMachineTokenBalanceQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: salePriceData,
    loading: loadingSalePrice,
    refetch: refetchCurrentPeriodPrice,
    startPolling: startPollingCurrentPeriodPrice,
    stopPolling: stopPollingCurrentPeriodPrice,
  } = useCoinMachineCurrentPeriodPriceQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: maxUserPurchaseData,
    loading: loadingMaxUserPurchase,
    refetch: refetchCurrentPeriodMaxUserPurchase,
    startPolling: startPollingCurrentPeriodMaxUserPurchase,
    stopPolling: stopPollingCurrentPeriodMaxUserPurchase,
  } = useCoinMachineCurrentPeriodMaxUserPurchaseQuery({
    variables: { colonyAddress, userAddress: walletAddress },
    fetchPolicy: 'network-only',
  });

  const hasSaleStarted = !bigNumberify(
    coinMachineTokenBalanceData?.coinMachineTokenBalance || 0,
  ).isZero();

  const periodTokens = useMemo(() => {
    if (!saleTokensData || !periodTokensData || !hasSaleStarted) {
      return undefined;
    }
    return {
      decimals: saleTokensData.coinMachineSaleTokens.sellableToken.decimals,
      soldPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.activeSoldTokens,
      ),
      maxPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.maxPerPeriodTokens,
      ),
      targetPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.targetPerPeriodTokens,
      ),
    };
  }, [periodTokensData, saleTokensData, hasSaleStarted]);

  const isSoldOut = useMemo(
    () =>
      periodTokens !== undefined &&
      periodTokens.soldPeriodTokens.gte(periodTokens.maxPeriodTokens),
    [periodTokens],
  );

  const timeRemaining = parseInt(
    currentSalePeriodData?.coinMachineCurrentSalePeriod?.timeRemaining || '0',
    10,
  );

  const periodLength = parseInt(
    currentSalePeriodData?.coinMachineCurrentSalePeriod?.periodLength || '0',
    10,
  );

  useEffect(() => {
    const tokenBoughtEventsLength =
      tokenBoughtEventsData?.tokenBoughtEvents.length || 0;
    if (tokenBoughtEventsCounter < tokenBoughtEventsLength) {
      refetchCurrentPeriodTokensData({ colonyAddress });
      setTokenBoughtEventsCounter(tokenBoughtEventsLength);
      refetchCurrentPeriodPrice();
      refetchCurrentPeriodMaxUserPurchase();
    }
  }, [
    colonyAddress,
    tokenBoughtEventsData,
    tokenBoughtEventsCounter,
    setTokenBoughtEventsCounter,
    refetchCurrentPeriodTokensData,
    refetchCurrentPeriodPrice,
    refetchCurrentPeriodMaxUserPurchase,
  ]);

  useEffect(() => {
    if (timeRemaining > 1000 && timeRemaining < periodLength * 1000) {
      setTimeout(() => {
        refetchCurrentPeriodTokensData({ colonyAddress });
        startPollingCurrentPeriodTokensData(periodLength * 1000);
        refetchCurrentPeriodPrice();
        startPollingCurrentPeriodPrice(periodLength * 1000);
        refetchCurrentPeriodMaxUserPurchase();
        startPollingCurrentPeriodMaxUserPurchase(periodLength * 1000);
      }, timeRemaining);
    } else {
      startPollingCurrentPeriodTokensData(periodLength * 1000);
      startPollingCurrentPeriodPrice(periodLength * 1000);
      startPollingCurrentPeriodMaxUserPurchase(periodLength * 1000);
    }
    return () => {
      stopPollingCurrentPeriodPrice();
      stopPollingCurrentPeriodTokensData();
      stopPollingCurrentPeriodMaxUserPurchase();
    };
  }, [
    colonyAddress,
    periodLength,
    timeRemaining,
    refetchCurrentPeriodTokensData,
    startPollingCurrentPeriodTokensData,
    stopPollingCurrentPeriodTokensData,
    stopPollingCurrentPeriodPrice,
    refetchCurrentPeriodPrice,
    startPollingCurrentPeriodPrice,
    refetchCurrentPeriodMaxUserPurchase,
    startPollingCurrentPeriodMaxUserPurchase,
    stopPollingCurrentPeriodMaxUserPurchase,
  ]);

  if (
    loadingExtensionsData ||
    saleTokensLoading ||
    currentSalePeriodLoading ||
    !extensionsData?.processedColony?.installedExtensions ||
    periodTokensLoading ||
    coinMachineTokenBalanceLoading ||
    loadingTokenBoughtEventsData
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

  const saleToken = saleTokensData?.coinMachineSaleTokens?.sellableToken;

  const breadCrumbs: Crumb[] = [
    MSG.title,
    <div>
      <FormattedMessage
        {...MSG.buyTokens}
        values={{ symbol: saleToken?.symbol }}
      />
      <ExternalLink
        className={styles.learnMore}
        text={{ id: 'text.learnMore' }}
        href={LEARN_MORE_LINK}
      />
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
              sellableToken={saleToken}
              timeLeftToNextSale={timeRemaining}
              transactionHash={transactionHash}
              purchaseToken={
                saleTokensData?.coinMachineSaleTokens?.purchaseToken
              }
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
              />
            </div>
            <div className={styles.tokensRemaining}>
              <RemainingTokens periodTokens={periodTokens} />
            </div>
          </>
        )}
        <div className={styles.sales}>
          <TokenSalesTable
            colonyAddress={colonyAddress}
            periodLength={periodLength}
            periodRemainingTime={timeRemaining}
            sellableToken={saleToken}
            periodTokens={periodTokens}
            extensionAddress={coinMachineExtension?.address}
          />
        </div>
        <div className={styles.comments}>
          <Chat
            colony={colony}
            transactionHash={coinMachineExtension.address}
            disabled={DISABLE_CHAT_UTIL_SALE}
          />
        </div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
