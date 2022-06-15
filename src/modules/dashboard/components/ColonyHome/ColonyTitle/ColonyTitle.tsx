import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Colony } from '~data/index';
import ColonySubscription from '../ColonySubscription';

import styles from './ColonyTitle.css';
import { mobile } from '~utils/mediaQueries';
import ColonyTitleHeading from './ColonyTitleHeading';
import ColonyTitleMenu from './ColonyTitleMenu';

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyTitle';

const ColonyTitle = ({ colony }: Props) => {
  const isMobile = useMediaQuery({ query: mobile });

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        {isMobile ? (
          // Render ColonySubscription outside of ColonyTitleMenu
          // on mobile.
          <>
            <div>
              <ColonyTitleHeading colony={colony} />
              <ColonyTitleMenu colony={colony} />
            </div>
            <ColonySubscription colony={colony} />
          </>
        ) : (
          <>
            <ColonyTitleHeading colony={colony} />
            <ColonyTitleMenu colony={colony}>
              <ColonySubscription colony={colony} />
            </ColonyTitleMenu>
          </>
        )}
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
