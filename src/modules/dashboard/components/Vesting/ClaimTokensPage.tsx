import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';

import VestingPageLayout from './VestingPageLayout';

const MSG = defineMessage({
  title: {
    id: 'dashboard.Vesting.ClaimTokensPage.title',
    defaultMessage: 'Claim {tokenSymbol}',
  },
  totalAllocation: {
    id: 'dashboard.Vesting.ClaimTokensPage.totalAllocation',
    defaultMessage: 'Total Allocation',
  },
  claimable: {
    id: 'dashboard.Vesting.ClaimTokensPage.claimable',
    defaultMessage: 'Claimable now',
  },
  claimed: {
    id: 'dashboard.Vesting.ClaimTokensPage.claimable',
    defaultMessage: 'Claimed',
  },
  buttonClaim: {
    id: 'dashboard.Vesting.ClaimTokensPage.buttonClaim',
    defaultMessage: 'Claim',
  },
});

const displayName = 'dashboard.Vesting.ClaimTokensPage';

const ClaimTokensPage = () => {
  // replace with a query later
  const token = {
    symbol: 'CLNY',
    totalAllocation: '1000000000000000000000000',
    claimable: '50000000000000000000000',
    claimed: '300000000000000000000',
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
          label: <FormattedMessage {...MSG.totalAllocation} />,
          value: token.totalAllocation,
          id: 1,
        },
        {
          label: <FormattedMessage {...MSG.claimable} />,
          value: token.claimable,
          id: 2,
        },
        {
          label: <FormattedMessage {...MSG.claimed} />,
          value: token.claimed,
          id: 3,
        },
      ]}
      buttonText={MSG.buttonClaim}
      tokenDecimals={token.decimals}
    />
  );
};

ClaimTokensPage.displayName = displayName;

export default ClaimTokensPage;
