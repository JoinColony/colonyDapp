import React, { useCallback, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';

import Decimal from 'decimal.js';
import Heading from '~core/Heading';
import TransactionLink from '~core/TransactionLink';
import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import TimerValue from '~core/TimerValue';
import { SpinnerLoader } from '~core/Preloaders';

import {
  TokenInfoQuery,
  useCoinMachineBoughtTokensQuery,
  useCoinMachineCurrentPeriodPriceQuery,
  useCoinMachineTransactionAmountQuery,
  Colony,
} from '~data/index';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import useSplitTime from '~utils/hooks/useSplitTime';

import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './SaleStateWidget.css';

export enum SaleState {
  SaleFailed = 'saleFailed',
  Loading = 'loading',
  TransactionFailed = 'transactionFailed',
  Success = 'success',
  PartialSuccess = 'partialSuccess',
}

interface Props {
  timeLeftToNextSale: number;
  sellableToken?: TokenInfoQuery['tokenInfo'];
  purchaseToken?: TokenInfoQuery['tokenInfo'];
  colony: Colony;
  transactionHash: string;
}

const MSG = defineMessages({
  blockExplorer: {
    id: 'dashboard.CoinMachine.SaleStateWidget.blockExplorer',
    defaultMessage: '{blockExplorerName}',
  },
  for: {
    id: 'dashboard.CoinMachine.SaleStateWidget.for',
    defaultMessage: 'For',
  },
  nextSale: {
    id: 'dashboard.CoinMachine.SaleStateWidget.nextSale',
    defaultMessage: 'Next sale starts in',
  },
  tryAgain: {
    id: 'dashboard.CoinMachine.SaleStateWidget.tryAgain',
    defaultMessage: 'Try Again',
  },
  buyAgain: {
    id: 'dashboard.CoinMachine.SaleStateWidget.buyAgain',
    defaultMessage: 'Buy Again',
  },
  saleFailedTitle: {
    id: 'dashboard.CoinMachine.SaleStateWidget.saleFailedTitle',
    defaultMessage: `You didn't get any CLNY this time`,
  },
  saleFailedAmountLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.saleFailedAmountLabel',
    defaultMessage: 'You tried to buy',
  },
  saleFailedText: {
    id: 'dashboard.CoinMachine.SaleStateWidget.saleFailedText',
    defaultMessage: 'Unfortunately, someone else was a little quicker. 😢',
  },
  saleFailedSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.saleFailedSubtext',
    defaultMessage: 'Don’t worry, you can try again in...',
  },
  loadingTitle: {
    id: 'dashboard.CoinMachine.SaleStateWidget.loadingTitle',
    defaultMessage: `Please wait...`,
  },
  loadingAmountLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.loadingAmountLabel',
    defaultMessage: 'You are trying to buy',
  },
  loadingText: {
    id: 'dashboard.CoinMachine.SaleStateWidget.loadingText',
    defaultMessage: 'Please don’t leave this screen.',
  },
  loadingSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.loadingSubtext',
    defaultMessage: 'We’re waiting for your transaction to be confirmed.',
  },
  transactionFailedTitle: {
    id: 'dashboard.CoinMachine.SaleStateWidget.transactionFailedTitle',
    defaultMessage: `Transaction failed`,
  },
  transactionFailedAmountLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.transactionFailedAmountLabel',
    defaultMessage: 'You tried to buy',
  },
  transactionFailedText: {
    id: 'dashboard.CoinMachine.SaleStateWidget.transactionFailedText',
    defaultMessage:
      'Unfortunately, something went wrong and your transaction failed.',
  },
  transactionFailedSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.transactionFailedSubtext',
    defaultMessage: 'Try increasing your gas price.',
  },
  successTitle: {
    id: 'dashboard.CoinMachine.SaleStateWidget.successTitle',
    defaultMessage: `Success! 🎉`,
  },
  successAmountLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.successAmountLabel',
    defaultMessage: 'You bought',
  },
  successText: {
    id: 'dashboard.CoinMachine.SaleStateWidget.successText',
    defaultMessage:
      'Congratulations! You have made a considerably wise purchase.',
  },
  successSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.successSubtext',
    defaultMessage: `Now {link} them so they're ready to use.`,
  },
  activate: {
    id: 'dashboard.CoinMachine.SaleStateWidget.activate',
    defaultMessage: `**Activate**`,
  },
  partialSuccessTitle: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessTitle',
    defaultMessage: `Partial Success...`,
  },
  partialSuccessAmountLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessAmountLabel',
    defaultMessage: 'You bought',
  },
  partialSuccessText: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessText',
    defaultMessage:
      'Unfortunately, you didn’t get quite as many tokens as you wanted. 😢 ',
  },
  partialSuccessSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessSubtext',
    defaultMessage: 'Better luck next time!',
  },
});

const ACTIVATE_LINK =
  'https://colony.gitbook.io/colony/key-concepts/token-activation';

const SaleStateWidget = ({
  sellableToken,
  purchaseToken,
  timeLeftToNextSale,
  colony: { colonyAddress, colonyName },
  transactionHash,
}: Props) => {
  const [state, setState] = useState<SaleState | null>(SaleState.Loading);
  const [decimalAmount, setDecimalAmount] = useState<string>('0');
  const [cost, setCost] = useState<string>('0');

  const showTimeCountdown =
    state === SaleState.PartialSuccess || state === SaleState.SaleFailed;
  const { splitTime } = useSplitTime(timeLeftToNextSale, showTimeCountdown);

  const {
    data: transactionAmountData,
    loading: transactionAmountLoading,
  } = useCoinMachineTransactionAmountQuery({
    variables: { colonyAddress, transactionHash },
  });

  const {
    data: salePriceData,
    loading: loadingSalePrice,
  } = useCoinMachineCurrentPeriodPriceQuery({
    variables: { colonyAddress },
  });

  const { data: boughtTokensData } = useCoinMachineBoughtTokensQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const buttonText = useCallback(() => {
    switch (state) {
      case SaleState.PartialSuccess:
      case SaleState.SaleFailed:
        return <TimerValue splitTime={splitTime} />;
      case SaleState.TransactionFailed:
        return <FormattedMessage {...MSG.tryAgain} />;
      case SaleState.Success:
        return <FormattedMessage {...MSG.buyAgain} />;
      default:
        return <FormattedMessage {...MSG.buyAgain} />;
    }
  }, [state, splitTime]);

  useEffect(() => {
    if (!salePriceData) return;
    if (boughtTokensData && transactionAmountData) {
      const {
        transactionAmount,
        transactionSucceed,
      } = transactionAmountData.coinMachineTransactionAmount;
      const { numTokens, totalCost } = boughtTokensData.coinMachineBoughtTokens;
      const decimalPrice = new Decimal(transactionAmount)
        .times(salePriceData.coinMachineCurrentPeriodPrice)
        .div(
          new Decimal(10).pow(
            getTokenDecimalsWithFallback(purchaseToken?.decimals),
          ),
        );

      let formattedAmount = getFormattedTokenValue(
        transactionAmount,
        sellableToken?.decimals,
      );
      let formattedPrice = getFormattedTokenValue(
        decimalPrice.toString(),
        purchaseToken?.decimals,
      );

      if (!transactionSucceed) {
        setState(SaleState.TransactionFailed);
      } else if (bigNumberify(numTokens).isZero()) {
        setState(SaleState.SaleFailed);
      } else if (bigNumberify(transactionAmount).gt(numTokens)) {
        formattedAmount = getFormattedTokenValue(
          numTokens,
          sellableToken?.decimals,
        );
        formattedPrice = getFormattedTokenValue(
          totalCost,
          purchaseToken?.decimals,
        );
        setState(SaleState.PartialSuccess);
      } else {
        setState(SaleState.Success);
      }
      setDecimalAmount(formattedAmount);
      setCost(formattedPrice);
    }
  }, [
    boughtTokensData,
    transactionAmountData,
    salePriceData,
    purchaseToken,
    sellableToken,
  ]);

  if (transactionAmountLoading || loadingSalePrice) {
    return (
      <div>
        <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading
          appearance={{ size: 'medium', theme: 'dark', margin: 'none' }}
          text={MSG[`${state}Title`]}
        />
        <TransactionLink
          className={styles.blockExplorer}
          hash={transactionHash}
          text={MSG.blockExplorer}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG[`${state}AmountLabel`]} />
          </div>
          <div className={styles.value}>
            {decimalAmount} {sellableToken?.symbol || '???'}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.for} />
          </div>
          <div className={styles.value}>
            {cost} {purchaseToken?.symbol || '???'}
          </div>
        </div>
      </div>
      <div className={styles.text}>
        <FormattedMessage {...MSG[`${state}Text`]} />
      </div>
      <div className={styles.text}>
        <FormattedMessage
          {...MSG[`${state}Subtext`]}
          values={{
            link: (
              <ExternalLink
                text={MSG.activate}
                className={styles.blockExplorer}
                href={ACTIVATE_LINK}
              />
            ),
          }}
        />
      </div>
      <div className={styles.footer}>
        {showTimeCountdown ? (
          <div className={styles.nextSale}>
            <FormattedMessage {...MSG.nextSale} />
          </div>
        ) : null}
        <div className={styles.buttonWrapper}>
          <Button
            appearance={{
              theme: showTimeCountdown ? 'pink' : 'primary',
              size: 'large',
            }}
            loading={state === SaleState.Loading}
            linkTo={`/colony/${colonyName}/buy-tokens/`}
          >
            {buttonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

SaleStateWidget.displayName = 'dashboard.CoinMachine.SaleStateWidget';

export default SaleStateWidget;
