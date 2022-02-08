import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import TokensTab, { TokensTabProps } from './TokensTab';
import StakesTab from './StakesTab';
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
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { colonyAddress, walletAddress } = props;

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
            <FormattedMessage {...MSG.stakes} />
          </Tab>
        </TabList>
        <TabPanel className={styles.tabContainer}>
          <TokensTab {...props} />
        </TabPanel>
        <TabPanel className={styles.tabContainer}>
          <StakesTab
            {...{
              colonyAddress,
              walletAddress,
            }}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TokenActivationContent;
