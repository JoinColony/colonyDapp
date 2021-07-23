import React, { useCallback, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import TransactionLink from '~core/TransactionLink';
import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';

import { TokenInfoQuery } from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';
import { splitTimeLeft } from '~utils/time';
import { TimerValue } from '~utils/components';

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
  state: SaleState;
  amount: string;
  price: string;
  timeLeftToNextSale: number;
  nativeToken: TokenInfoQuery['tokenInfo'];
  transactionToken: TokenInfoQuery['tokenInfo'];
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
  state,
  amount,
  price,
  nativeToken,
  transactionToken,
  timeLeftToNextSale,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLeftToNextSale / 1000);
  const decimalAmount = getFormattedTokenValue(amount, nativeToken.decimals);
  const decimalPrice = getFormattedTokenValue(price, transactionToken.decimals);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);
  const splitTime = splitTimeLeft(timeLeft);

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

  const showTimeCountdown =
    state === SaleState.PartialSuccess || state === SaleState.SaleFailed;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading
          appearance={{ size: 'medium', theme: 'dark', margin: 'none' }}
          text={MSG[`${state}Title`]}
        />
        <TransactionLink
          className={styles.blockExplorer}
          hash=""
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
            {decimalAmount} {nativeToken.symbol || '???'}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.for} />
          </div>
          <div className={styles.value}>
            {decimalPrice} {transactionToken.symbol || '???'}
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
        <Button
          appearance={{
            theme: showTimeCountdown ? 'pink' : 'primary',
            size: 'large',
          }}
          loading={state === SaleState.Loading}
        >
          {buttonText()}
        </Button>
      </div>
    </div>
  );
};

SaleStateWidget.displayName = 'dashboard.CoinMachine.SaleStateWidget';

export default SaleStateWidget;
