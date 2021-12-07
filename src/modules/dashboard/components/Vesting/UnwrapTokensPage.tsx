import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';

import VestingPageLayout from './VestingPageLayout';

const MSG = defineMessage({
  title: {
    id: 'dashboard.Vesting.UnwrapTokensPage.title',
    defaultMessage: 'Unwrap w{tokenSymbol}',
  },
  wrappedBalance: {
    id: 'dashboard.Vesting.UnwrapTokensPage.wrappedBalance',
    defaultMessage: 'w{tokenSymbol} balance',
  },
  balance: {
    id: 'dashboard.Vesting.UnwrapTokensPage.balance',
    defaultMessage: '{tokenSymbol} balance',
  },
  buttonUnwrap: {
    id: 'dashboard.Vesting.UnwrapTokensPage.buttonUnwrap',
    defaultMessage: 'Unwrap {tokenSymbol}',
  },
});

const displayName = 'dashboard.Vesting.UnwrapTokensPage';

const UnwrapTokensPage = () => {
  // replace with a query later
  const token = {
    symbol: 'CLNY',
    wrappedBalance: '70000000000000000000000',
    balance: '300000000000000000000',
    decimals: 18,
  };

  return (
    <VestingPageLayout
      // Add proper loading state when connected to queries
      isLoading={false}
      title={
        <Heading
          appearance={{ size: 'medium', theme: 'dark' }}
          text={MSG.title}
          textValues={{ tokenSymbol: token?.symbol }}
        />
      }
      tableValues={[
        {
          label: (
            <FormattedMessage
              {...MSG.wrappedBalance}
              values={{ tokenSymbol: token?.symbol }}
            />
          ),
          value: token.wrappedBalance,
        },
        {
          label: (
            <FormattedMessage
              {...MSG.balance}
              values={{ tokenSymbol: token?.symbol }}
            />
          ),
          value: token.balance,
        },
      ]}
      buttonText={MSG.buttonUnwrap}
      buttonTextValues={{ tokenSymbol: token?.symbol }}
      tokenDecimals={token.decimals}
    />
  );
};

UnwrapTokensPage.displayName = displayName;

export default UnwrapTokensPage;
