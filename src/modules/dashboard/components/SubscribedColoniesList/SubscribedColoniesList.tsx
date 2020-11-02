import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyAvatar from '~core/ColonyAvatar';
import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import { useLoggedInUser, useUserColoniesQuery } from '~data/index';
import { CREATE_COLONY_ROUTE } from '~routes/index';

import styles from './SubscribedColoniesList.css';

const MSG = defineMessages({
  iconTitleCreateNewColony: {
    id: 'dashboard.SubscribedColoniesList.iconTitleCreateNewColony',
    defaultMessage: 'Create New Colony',
  },
});

const displayName = 'dashboard.SubscribedColoniesList';

const SubscribedColoniesList = () => {
  const { ethereal, walletAddress } = useLoggedInUser();
  const { data } = useUserColoniesQuery({
    variables: { address: walletAddress },
  });

  return (
    <div className={styles.main}>
      <div className={styles.scrollableContainer}>
        {data &&
          data.user.colonies.map((colony) => {
            const { colonyAddress, colonyName } = colony;
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
      {!ethereal && (
        <div className={`${styles.item} ${styles.newColonyItem}`}>
          <NavLink className={styles.itemLink} to={CREATE_COLONY_ROUTE}>
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
