import React from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import Icon from '~core/Icon';
import { SpinnerLoader } from '~core/Preloaders';
import NavLink from '~core/NavLink';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import { useLoggedInUser, useUserColoniesQuery } from '~data/index';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './SubscribedColoniesList.css';
import { query700 as query } from '~styles/queries.css';

const MSG = defineMessages({
  iconTitleCreateNewColony: {
    id: 'dashboard.SubscribedColoniesList.iconTitleCreateNewColony',
    defaultMessage: 'Create New Colony',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const displayName = 'dashboard.SubscribedColoniesList';

const SubscribedColoniesList = () => {
  const { walletAddress, networkId, ethereal } = useLoggedInUser();
  const { data, loading } = useUserColoniesQuery({
    variables: { address: walletAddress },
  });

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const isMobile = useMediaQuery({ query });

  return (
    <div className={styles.main}>
      <div className={styles.scrollableContainer}>
        {loading && (
          <div className={styles.loadingColonies}>
            <SpinnerLoader appearance={{ size: 'medium' }} />
          </div>
        )}
        {!loading &&
          data?.user?.processedColonies.map((colony) => {
            const { colonyAddress, colonyName } = colony as {
              colonyAddress: string;
              colonyName: string;
            };
            return (
              <div className={styles.item} key={colonyAddress}>
                <NavLink
                  activeClassName={styles.activeColony}
                  className={styles.itemLink}
                  title={colonyName}
                  to={`/colony/${colonyName}`}
                >
                  <div className={styles.itemImage}>
                    <ColonyAvatar
                      colony={colony}
                      colonyAddress={colonyAddress}
                      size={isMobile ? 'xs' : 's'}
                    />
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
      {(ethereal || isNetworkAllowed) && (
        <div className={`${styles.item} ${styles.newColonyItem}`}>
          <NavLink
            className={styles.itemLink}
            to={CREATE_COLONY_ROUTE}
            data-test="createColony"
          >
            <Icon
              className={styles.newColonyIcon}
              name="circle-plus"
              title={MSG.iconTitleCreateNewColony}
            />
          </NavLink>
        </div>
      )}
    </div>
  );
};

SubscribedColoniesList.displayName = displayName;

export default SubscribedColoniesList;
