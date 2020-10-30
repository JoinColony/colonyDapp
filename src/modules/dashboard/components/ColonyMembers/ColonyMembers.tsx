import React from 'react';
import { defineMessages } from 'react-intl';

import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { DASHBOARD_ROUTE } from '~routes/index';
import { Colony, useColonySubscribedUsersQuery, AnyUser } from '~data/index';

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
  /*
   * @TODO This will most likely be replaces with a request to the reputation
   * oracle, in order to fetch the users sorted by reputation
   */
  const {
    data: colonySubscribedUsers,
    loading: loadingColonySubscribedUsers,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  if (!colonySubscribedUsers || loadingColonySubscribedUsers) {
    /*
     * @TODO Add loading spinner
     */
    return <div className={styles.main} />;
  }

  const {
    colony: { subscribedUsers },
  } = colonySubscribedUsers;

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
          textValues={{ count: subscribedUsers.length }}
        />
      </NavLink>
      <ul className={styles.userAvatars}>
        {(subscribedUsers as AnyUser[]).map((user) => (
          <li className={styles.userAvatar} key={user.id}>
            <UserAvatar
              colonyAddress={colonyAddress}
              address={user.profile.walletAddress}
              user={user}
              showInfo
              notSet={false}
              popperProps={{
                placement: 'left',
                showArrow: false,
                children: () => null,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
