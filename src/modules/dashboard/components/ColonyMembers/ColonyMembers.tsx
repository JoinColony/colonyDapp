import React from 'react';
import { defineMessages } from 'react-intl';

import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { DASHBOARD_ROUTE } from '~routes/index';
import { Colony, useLoggedInUser } from '~data/index';

import styles from './ColonyMembers.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyMembers.title',
    defaultMessage: 'Members ({count})',
  },
});

interface Props {
  colony: Colony;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const displayName = 'dashboard.ColonyMembers';

const ColonyMembers = ({ colony: { colonyAddress } }: Props) => {
  const { walletAddress } = useLoggedInUser();
  return (
    <div className={styles.main}>
      <NavLink
        /*
         * @TODO Put in the Community route, once that is created in DEV-13
         */
        to={DASHBOARD_ROUTE}
      >
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.title}
          /*
           * @TODO Put in actual count value
           */
          textValues={{ count: 33 }}
        />
      </NavLink>
      <ul className={styles.userAvatars}>
        <li className={styles.userAvatar}>
          <UserAvatar
            colonyAddress={colonyAddress}
            address={walletAddress}
            // user={user}
            showInfo
            notSet={false}
            popperProps={{
              placement: 'left',
              showArrow: false,
              children: () => null,
            }}
          />
        </li>
      </ul>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
