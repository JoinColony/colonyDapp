import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import { SpinnerLoader } from '~core/Preloaders';
import NavLink from '~core/NavLink';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import { useLoggedInUser, useUserColoniesQuery } from '~data/index';
import { CREATE_COLONY_ROUTE } from '~routes/index';

import styles from './SubscribedColoniesList.css';

const MSG = defineMessages({
  iconTitleCreateNewColony: {
    id: 'dashboard.SubscribedColoniesList.iconTitleCreateNewColony',
    defaultMessage: 'Create New Colony',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const displayName = 'dashboard.SubscribedColoniesList';

const SubscribedColoniesList = () => {
  const { walletAddress } = useLoggedInUser();
  const { data, error, loading } = useUserColoniesQuery({
    variables: { address: walletAddress },
  });

  if (error) {
    console.error(error);
  }

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
                      size="xs"
                    />
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
      <div className={`${styles.item} ${styles.newColonyItem}`}>
        <NavLink className={styles.itemLink} to={CREATE_COLONY_ROUTE}>
          <Icon
            className={styles.newColonyIcon}
            name="circle-plus"
            title={MSG.iconTitleCreateNewColony}
          />
        </NavLink>
      </div>
    </div>
  );
};

SubscribedColoniesList.displayName = displayName;

export default SubscribedColoniesList;
