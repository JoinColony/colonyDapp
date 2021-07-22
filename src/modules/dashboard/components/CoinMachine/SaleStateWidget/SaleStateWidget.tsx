import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';

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
  nextSale: number;
}

const MSG = defineMessages({
  etherscan: {
    id: 'dashboard.CoinMachine.SaleStateWidget.etherscan',
    defaultMessage: 'Etherscan',
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
    defaultMessage: 'Unfortunately, something went wrong and your transaction failed.',
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
    defaultMessage: 'Congratulations! You have made a considerably wise purchase.',
  },
  successSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.successSubtext',
    defaultMessage: 'Now deposit them in Locking so they’re ready to use.',
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
    defaultMessage: 'Unfortunately, you didn’t get quite as many tokens as you wanted. 😢 ',
  },
  partialSuccessSubtext: {
    id: 'dashboard.CoinMachine.SaleStateWidget.partialSuccessSubtext',
    defaultMessage: 'Better luck next time!',
  },
});

const SaleStateWidget = ({

}: Props) => {

  return (
    <div>

    </div>
  );
};

SaleStateWidget.displayName = 'dashboard.CoinMachine.SaleStateWidget';

export default SaleStateWidget;
