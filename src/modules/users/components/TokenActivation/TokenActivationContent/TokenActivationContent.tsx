import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { useClaimableStakedMotionsQuery } from '~data/generated';

import TokensTab, { TokensTabProps } from '../TokensTab/TokensTab';
import StakesTab from '../StakesTab/StakesTab';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  yourTokens: {
    id: 'users.TokenActivation.TokenActivationContent.yourTokens',
    defaultMessage: 'Your tokens',
  },
  stakes: {
    id: 'users.TokenActivation.TokenActivationContent.stakes',
    defaultMessage: 'Stakes',
  },
});

const TokenActivationContent = (props: TokensTabProps) => {
  // const [claimsCount, setClaimsCount] = useState<number>(0);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { colonyAddress, walletAddress, token } = props;

  const { data: unclaimedMotions, loading } = useClaimableStakedMotionsQuery({
    variables: {
      colonyAddress: colonyAddress?.toLowerCase(),
      walletAddress: walletAddress?.toLowerCase(),
    },
    fetchPolicy: 'network-only',
  });

  const claimsCount =
    unclaimedMotions?.claimableStakedMotions?.claimableStakedMotions.length ||
    0;
  // console.log(
  //   'unclaimedMotions?.claimableStakedMotions?.claimableStakedMotions: ',
  //   unclaimedMotions?.claimableStakedMotions,
  // );

  return (
    <div className={styles.main}>
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(newIndex) => {
          setTabIndex(newIndex);
        }}
      >
        <TabList
          className={styles.tabsList}
          containerClassName={styles.tabsListContainer}
        >
          <Tab selectedClassName={styles.tabSelected} className={styles.tab}>
            <FormattedMessage {...MSG.yourTokens} />
          </Tab>
          <Tab selectedClassName={styles.tabSelected} className={styles.tab}>
            <div className={styles.stakesTabTitle}>
              <FormattedMessage {...MSG.stakes} />
              {claimsCount > 0 && (
                <div className={styles.dot}>{claimsCount}</div>
              )}
            </div>
          </Tab>
        </TabList>
        <TabPanel className={styles.tabContainer}>
          <TokensTab {...props} />
        </TabPanel>
        <TabPanel className={styles.tabContainer}>
          <StakesTab {...{ unclaimedMotions, loading, token }} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TokenActivationContent;
