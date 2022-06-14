import React from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { Colony } from '~data/index';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';
import ColonySubscription from '../ColonySubscription';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';

import styles from './ColonyTitle.css';
import { mobile } from '~utils/mediaQueries';

const MSG = defineMessages({
  fallbackColonyName: {
    id: 'dashboard.ColonyHome.ColonyTitle.fallbackColonyName',
    defaultMessage: 'Unknown Colony',
  },
  copyMessage: {
    id: 'dashboard.ColonyHome.ColonyTitle.copyMessage',
    defaultMessage: 'Click to copy colony address',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyTitle';

const ColonyTitle = ({
  colony: { displayName: colonyDisplayName, colonyName, colonyAddress },
  colony,
}: Props) => {
  const isMobile = useMediaQuery({ query: mobile });

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        {isMobile ? (
          // Render ColonySubscription outside of .colonyMenu
          // on mobile.
          <>
            <div>
              <div className={styles.colonyTitle}>
                <Heading
                  appearance={{
                    size: 'medium',
                    weight: 'medium',
                    margin: 'none',
                  }}
                  text={
                    colonyDisplayName || colonyName || MSG.fallbackColonyName
                  }
                  data-test="colonyTitle"
                />
              </div>
              <div className={styles.colonyMenu}>
                {colonyAddress && (
                  <InvisibleCopyableAddress
                    address={colonyAddress}
                    copyMessage={MSG.copyMessage}
                  >
                    <div className={styles.colonyAddress}>
                      <MaskedAddress address={colonyAddress} />
                    </div>
                  </InvisibleCopyableAddress>
                )}
              </div>
            </div>
            <ColonySubscription colony={colony} />
          </>
        ) : (
          <>
            <div className={styles.colonyTitle}>
              <Heading
                appearance={{
                  size: 'medium',
                  weight: 'medium',
                  margin: 'none',
                }}
                text={colonyDisplayName || colonyName || MSG.fallbackColonyName}
                data-test="colonyTitle"
              />
            </div>
            <div className={styles.colonyMenu}>
              {colonyAddress && (
                <InvisibleCopyableAddress
                  address={colonyAddress}
                  copyMessage={MSG.copyMessage}
                >
                  <div className={styles.colonyAddress}>
                    <MaskedAddress address={colonyAddress} />
                  </div>
                </InvisibleCopyableAddress>
              )}
              <ColonySubscription colony={colony} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
