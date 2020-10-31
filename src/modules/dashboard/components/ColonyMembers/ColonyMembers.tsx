import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';

import { DASHBOARD_ROUTE } from '~routes/index';
import { Colony, useColonySubscribedUsersQuery, AnyUser } from '~data/index';

import styles from './ColonyMembers.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyMembers.title',
    defaultMessage: `Members{hasCounter, select,
      true { ({count})}
      false {}
    }`,
  },
  loadingData: {
    id: 'dashboard.ColonyMembers.loadingData',
    defaultMessage: 'Loading members information...',
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
    return (
      <div className={styles.main}>
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.title}
          textValues={{ hasCounter: false }}
        />
        <SpinnerLoader appearance={{ size: 'small' }} />
        <span className={styles.loadingText}>
          <FormattedMessage {...MSG.loadingData} />
        </span>
      </div>
    );
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
          textValues={{ count: subscribedUsers.length, hasCounter: true }}
        />
      </NavLink>
      <ul className={styles.userAvatars}>
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
                  placement: 'bottom',
                  showArrow: false,
                  /*
                   * @NOTE This is the price we have to pay for the ability
                   * to customize the Popor library, which is nested under the
                   * Popover component, which is nested under UserInfo,
                   * which is nested under UserAvatar
                   */
                  children: () => null,
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        /*
                         * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
                         *
                         * There's no logic to how they are calculated, so next time you need
                         * to change them you'll either have to go by exact specs, or change
                         * them until it "feels right" :)
                         */
                        offset: [-208, -12],
                      },
                    },
                  ],
                }}
              />
            </li>
          ))}
        {!!remainingAvatarsCount && (
          <li className={styles.remaningAvatars}>
            {remainingAvatarsCount < 99 ? remainingAvatarsCount : `>99`}
          </li>
        )}
      </ul>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
