import React, { useCallback, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { Share } from 'react-twitter-widgets';

import Decimal from 'decimal.js';
import Numeral from '~core/Numeral';
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
import { TOKEN_ACTIVATION_INFO } from '~externalUrls';

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
  canShare?: boolean;
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
    defaultMessage: `You didn't get any {token} this time`,
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
    defaultMessage: 'Please try again, if there is still time and tokens left.',
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
    defaultMessage: `Please don't leave this screen.`,
  },
  loadingSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.loadingSubtext',
    defaultMessage: `We're waiting for your transaction to be confirmed.`,
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
    defaultMessage: `Congratulations! You have made a considerably wise purchase. Please {activateLink} your tokens so they're ready to use.`,
  },
  activate: {
    id: 'dashboard.CoinMachine.SaleStateWidget.activate',
    defaultMessage: `activate`,
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
    defaultMessage: `Unfortunately, you didn't get quite as many tokens as you wanted. 😢`,
  },
  partialSuccessSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessSubtext',
    defaultMessage: 'Better luck next time!',
  },
  shareLabel: {
    id: 'dashboard.CoinMachine.SaleStateWidget.shareLabel',
    defaultMessage: `Now share the good news {shareButton}`,
  },
  shareMessage: {
    id: 'dashboard.CoinMachine.SaleStateWidget.shareLabel',
    defaultMessage: `Success! I just used @joincolony #CoinMachine to buy {amount} {tokenSymbol} from`,
  },
});

const SaleStateWidget = ({
  sellableToken,
  purchaseToken,
  timeLeftToNextSale,
  colony: { colonyAddress, colonyName },
  transactionHash,
  canShare = false,
}: Props) => {
  const [state, setState] = useState<SaleState | null>(SaleState.Loading);
  const [decimalAmount, setDecimalAmount] = useState<string>('0');
  const [cost, setCost] = useState<string>('0');
  const { formatMessage } = useIntl();

  const BUY_TOKENS_ROUTE = `/colony/${colonyName}/buy-tokens`;

  const showTimeCountdown =
    state === SaleState.PartialSuccess || state === SaleState.SaleFailed;
  const { splitTime } = useSplitTime(
    timeLeftToNextSale / 1000,
    showTimeCountdown,
  );

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
    variables: { colonyAddress, transactionHash },
    fetchPolicy: 'network-only',
  });

  const buttonText = useCallback(() => {
    switch (state) {
      case SaleState.PartialSuccess:
      case SaleState.SaleFailed:
        if (showTimeCountdown && timeLeftToNextSale > 0) {
          return <TimerValue splitTime={splitTime} />;
        }
        return <FormattedMessage {...MSG.tryAgain} />;

      case SaleState.TransactionFailed:
        return <FormattedMessage {...MSG.tryAgain} />;
      case SaleState.Success:
        return <FormattedMessage {...MSG.buyAgain} />;
      default:
        return <FormattedMessage {...MSG.buyAgain} />;
    }
  }, [state, splitTime, showTimeCountdown, timeLeftToNextSale]);

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
        )
        .toFixed(0, Decimal.ROUND_HALF_UP);

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
          textValues={{
            token: sellableToken?.symbol || '',
          }}
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
            <Numeral
              value={decimalAmount}
              suffix={sellableToken?.symbol || '???'}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.for} />
          </div>
          <div className={styles.value}>
            <Numeral value={cost} suffix={purchaseToken?.symbol || '???'} />
          </div>
        </div>
      </div>
      <div className={styles.text}>
        <FormattedMessage
          {...MSG[`${state}Text`]}
          values={{
            activateLink: (
              <ExternalLink
                text={MSG.activate}
                className={styles.blockExplorer}
                href={TOKEN_ACTIVATION_INFO}
              />
            ),
          }}
        />
      </div>
      {MSG?.[`${state}Subtext`] && (
        <div className={styles.text}>
          <FormattedMessage {...MSG[`${state}Subtext`]} />
        </div>
      )}
      {state === SaleState.Success && canShare && (
        <div className={styles.share}>
          <FormattedMessage
            {...MSG.shareLabel}
            values={{
              shareButton: (
                <span>
                  <Share
                    url={`${window.location.host}${BUY_TOKENS_ROUTE}`}
                    options={{
                      text: formatMessage(MSG.shareMessage, {
                        amount: decimalAmount,
                        tokenSymbol: `$${sellableToken?.symbol || '???'}`,
                      }),
                      dnt: true,
                    }}
                  />
                </span>
              ),
            }}
          />
        </div>
      )}
      <div
        className={
          state === SaleState.TransactionFailed ||
          state === SaleState.PartialSuccess
            ? styles.footerSmall
            : styles.footer
        }
      >
        {showTimeCountdown && timeLeftToNextSale > 0 ? (
          <div className={styles.nextSale}>
            <FormattedMessage {...MSG.nextSale} />
          </div>
        ) : null}
        <div className={styles.buttonWrapper}>
          {state === SaleState.Loading ? (
            <Button
              text={{ id: 'label.waiting' }}
              appearance={{
                theme: 'primary',
                size: 'large',
              }}
              loading
            />
          ) : (
            <Button
              appearance={{
                theme: showTimeCountdown ? 'pink' : 'primary',
                size: 'large',
              }}
              linkTo={BUY_TOKENS_ROUTE}
            >
              {buttonText()}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

SaleStateWidget.displayName = 'dashboard.CoinMachine.SaleStateWidget';

export default SaleStateWidget;
