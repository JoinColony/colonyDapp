import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';

import VestingPageLayout from './VestingPageLayout';

const MSG = defineMessage({
  title: {
    id: 'dashboard.Vesting.ClaimTokensPage.title',
    defaultMessage: 'Unwrap {tokenName}',
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
    // <div className={styles.main}>
    //   <Heading
    //     appearance={{ size: 'medium', theme: 'dark' }}
    //     text={MSG.title}
    //     textValues={{ tokenName: token?.symbol }}
    //   />
    //   <div className={styles.table}>
    //     <div className={styles.item}>
    //       <div className={styles.label}>
    //         <FormattedMessage {...MSG.totalAllocation} />
    //       </div>
    //       <div className={styles.value}>
    //         <Numeral
    //           value={getFormattedTokenValue(
    //             token.totalAllocation,
    //             token.decimals,
    //           )}
    //         />
    //       </div>
    //     </div>
    //     <div className={styles.item}>
    //       <div className={styles.label}>
    //         <FormattedMessage {...MSG.claimable} />
    //       </div>
    //       <div className={styles.value}>
    //         <Numeral
    //           value={getFormattedTokenValue(
    //             token.totalAllocation,
    //             token.decimals,
    //           )}
    //         />
    //       </div>
    //     </div>
    //     <div className={styles.item}>
    //       <div className={styles.label}>
    //         <FormattedMessage {...MSG.claimed} />
    //       </div>
    //       <div className={styles.value}>
    //         <Numeral
    //           value={getFormattedTokenValue(
    //             token.totalAllocation,
    //             token.decimals,
    //           )}
    //         />
    //       </div>
    //     </div>
    //     <div className={styles.value}>
    //       <Button
    //         appearance={{ theme: 'primary', size: 'large' }}
    //         text={MSG.buttonClaim}
    //       />
    //     </div>
    //   </div>
    // </div>
    <VestingPageLayout
      title={
        <Heading
          appearance={{ size: 'medium', theme: 'dark' }}
          text={MSG.title}
          textValues={{ tokenName: token?.symbol }}
        />
      }
      tableValues={[
        {
          label: <FormattedMessage {...MSG.totalAllocation} />,
          value: token.totalAllocation,
        },
        {
          label: <FormattedMessage {...MSG.claimable} />,
          value: token.claimable,
        },
        {
          label: <FormattedMessage {...MSG.claimed} />,
          value: token.claimed,
        },
      ]}
      buttonText={MSG.buttonClaim}
      tokenDecimals={token.decimals}
    />
  );
};

ClaimTokensPage.displayName = displayName;

export default ClaimTokensPage;
