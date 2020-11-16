import React, { useMemo } from 'react';
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
const MAX_AVATARS = 15;

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

  const avatarsDisplaySplitRules = useMemo(() => {
    if (
      !colonySubscribedUsers ||
      !colonySubscribedUsers.colony.subscribedUsers.length
    ) {
      return 0;
    }
    const {
      colony: { subscribedUsers },
    } = colonySubscribedUsers;
    if (subscribedUsers.length <= MAX_AVATARS) {
      return subscribedUsers.length;
    }
    return MAX_AVATARS - 1;
  }, [colonySubscribedUsers]);

  const remainingAvatarsCount = useMemo(() => {
    if (
      !colonySubscribedUsers ||
      !colonySubscribedUsers.colony.subscribedUsers.length
    ) {
      return 0;
    }
    const {
      colony: { subscribedUsers },
    } = colonySubscribedUsers;
    if (subscribedUsers.length <= MAX_AVATARS) {
      return 0;
    }
    return subscribedUsers.length - MAX_AVATARS;
  }, [colonySubscribedUsers]);

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
      <ul>
        {(subscribedUsers as AnyUser[])
          .slice(0, avatarsDisplaySplitRules)
          .map((user) => (
            <li className={styles.userAvatar} key={user.id}>
              <UserAvatar
                size="xs"
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
        {!!remainingAvatarsCount && (
          <li className={styles.remaningAvatars}>
            {remainingAvatarsCount < 99
              ? remainingAvatarsCount
              : `>${remainingAvatarsCount}`}
          </li>
        )}
      </ul>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
